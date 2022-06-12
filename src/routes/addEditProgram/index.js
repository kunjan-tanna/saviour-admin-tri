
import React, { Component, useState } from 'react';
import { Helmet } from "react-helmet";
import Button from '@material-ui/core/Button';
import joi from 'joi-browser';
import moment, { now } from 'moment'
import {
	Row,
	Col,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	FormGroup,
	Input,
	Form,
	Label,
	Alert,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
} from 'reactstrap';

import { addProgramDetails, getAllProgramListById, editProgramDetails } from '../../actions/ProgramAction';
import { connect } from 'react-redux';
import AppConfig from '../../constants/AppConfig';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Tooltip from '@material-ui/core/Tooltip';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Select from 'react-select';
import * as common from '../../api/index';
import Images from '../../assets/images';
import NumberFormat from 'react-number-format';
import queryString from 'query-string';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { convertDateToTimeStamp, getTheDate, getFormattedDate, getFormattedDates } from "Helpers/helpers";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Editor } from '@tinymce/tinymce-react';

// import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const getHtml = editorState => draftToHtml(convertToRaw(editorState.getCurrentContent())); {/* new */ }

// let file = [];
// let doc = [];
let deletedDoc = []
let videoThumb = '';
let trailer_video_thumb = '';
let global_video_key = ''

let videoImg;
let trailer_video_img;
class AddEditProgram extends Component {
	constructor(props) {
		super(props);
		var date = new Date(),
			date = moment().format('DD-MM-YYYY hh:mm')
		this.state = {
			formValues: {
				instructor_name: '',
				instructor_expertise: '',
				instructor_description: '',
				instructor_quote: '',
				quote_by: '',
				program_name: '',
				program_duration: '',
				program_level: '',
				start_datetime: date,
			},
			start_datetime: date,
			error: '',
			videoImg: '',
			errorField: '',
			idocuments: [],
			vdocuments: [],
			ImageNames: [],
			videoNames: [],
			showForm: false,
			showModal: false,
			images: [],
			videos: [],
			quiz_video: '',
			videoImg: '',
			trailer_videos: [],
			trailer_video_img: '',
			trailer_video_names: [],
			trailer_video_documents: [],
			trailer_video: '',
			editorState: EditorState.createEmpty(),
			CKEditorConfig: {
				// toolbar: {
				// 	items: [
				// 		'heading', '|',
				// 		'alignment', '|',
				// 		'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
				// 		'link', '|',
				// 		'bulletedList', 'numberedList', 'todoList',
				// 		'-', // break point
				// 		'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor', '|',
				// 		'code', 'codeBlock', '|',
				// 		'insertTable', '|',
				// 		'uploadImage', 'blockQuote', '|',
				// 	],
				// },
				// fontFamily: {
				// 	editor: ClassicEditor,
				// 	isEnabled: true,
				// 	supportAllValues: true,
				// 	options: [
				// 		'default',
				// 		'Arial, Helvetica, sans-serif',
				// 		'Courier New, Courier, monospace',
				// 		'Georgia, serif',
				// 		'Lucida Sans Unicode, Lucida Grande, sans-serif',
				// 		'Tahoma, Geneva, sans-serif',
				// 		'Times New Roman, Times, serif',
				// 		'Trebuchet MS, Helvetica, sans-serif',
				// 		'Verdana, Geneva, sans-serif'
				// 	],
				// }

				toolbar: [
					"heading",
					"|",
					"fontFamily",
					"fontSize",
					"|",
					"bold",
					"italic",
					"link",
					// "bulletedList",
					// "numberedList",
					"|",
					"blockQuote",
				],
				heading: {
					options: [
						{
							model: "paragraph",
							title: "Paragraph",
							class: "ck-heading_paragraph",
						},
						{
							model: "heading1",
							view: "h1",
							title: "Heading 1",
							class: "ck-heading_heading1",
						},
						{
							model: "heading2",
							view: "h2",
							title: "Heading 2",
							class: "ck-heading_heading2",
						},
					],
				},
				fontFamily: {
					options: [
						'default',
						'Arial, Helvetica, sans-serif',
						'Courier New, Courier, monospace',
						'Georgia, serif',
						'Lucida Sans Unicode, Lucida Grande, sans-serif',
						'Tahoma, Geneva, sans-serif',
						'Times New Roman, Times, serif',
						'Trebuchet MS, Helvetica, sans-serif',
						'Verdana, Geneva, sans-serif'
					],
				},
				fontSize: {
					options: [9, 11, 13, "default", 17, 19, 21],
				},


			},

		}
		this.params = queryString.parse(this.props.location.search)
	}
	changeDateTime = this.changeDateTime.bind(this)
	changeDateTime(date) {

		// console.log("state", date)
		var formValues = this.state.formValues;
		formValues['start_datetime'] = date;

		this.setState({ formValues: formValues });

		// console.log("state", this.state.formValues)
		console.log(date)
		this.setState({ start_datetime: date })
	}
	async componentDidMount() {

		if (this.params.program_id) {
			await this.getProgramDetails();
		}

		const blocksFromHtml = htmlToDraft(this.state.formValues.instructor_description);

		// Create editor content with HTMl blocks
		const { contentBlocks, entityMap } = blocksFromHtml;
		const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

		// Create final content fro editor
		const editorState = EditorState.createWithContent(contentState);
		await this.setState({
			editorState: editorState,
		})

	}

	editrConfig = () => {
		let configuration = {
			toolbar: [
				['Cut', 'Copy', 'PasteText', 'PasteFromWord', 'SpellCheck', 'Paste', 'Undo', 'Redo', '-', 'Link', 'Unlink', 'Anchor', '-'],
				['Image', 'Table', 'HorizontalRule', 'SpecialChar', '-', 'Maximize', '-'],
				{ name: 'document', items: ['Source'] },
				'/',
				['Bold', 'Italic', 'Strike', 'Underline', '-', 'RemoveFormat'],
				['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'],
				['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'TextColor', 'BGColor'],
				['mkField'],
				'/',
				['Styles', 'Format', 'Font', 'FontSize'],
			],
			filebrowserUploadUrl: config.url + 'upload',

		}


		window.CKEDITOR.replace(this.props.id, configuration);
		window.CKEDITOR.inline(this.props.id);
		// window.CKEDITOR.plugins.addExternal( 'imageresize', '../imageresize-master/plugin', 'plugin.js' );
		window.CKEDITOR.instances[this.props.id].on("change", function () {
			let data = window.CKEDITOR.instances[this.props.id].getData();
			this.setTxt(data);
		}.bind(this));

	}

	setTxt = async (data) => {
		await this.setState({
			formValues: {
				...this.state.formValues,
				instructor_discription: data
			}
		})
	}

	// componentDidUpdate(prevProps, prevState) {
	// 	if (prevState.editorState !== this.state.editorState) {
	// 		this.setState({ editorState: this.state.editorState });
	// 	}
	// }

	getProgramDetails = async () => {

		let reqData = { program_id: this.params.program_id }
		let program = await this.props.getAllProgramListById(reqData);
		if (this.props.getAllProgramByIdData && this.props.getAllProgramByIdData.data) {
			let programData = this.props.getAllProgramByIdData.data
			console.log("programData==========", programData)

			console.log("start_datetime", getTheDate(programData.start_datetime, 'DD-MM-YYYY hh:mm a'))
			let formData = {
				instructor_expertise: programData.instructor_expertise,
				instructor_description: programData.instructor_description,
				instructor_quote: programData.instructor_quote,
				program_overview: programData.program_overview,
				quote_by: programData.quote_by,
				instructor_name: programData.instructor_name,
				program_duration: programData.program_duration,
				program_level: programData.program_level,
				program_name: programData.program_name,
				// start_datetime: getTheDate(programData.start_datetime, 'DD-MM-YYYY hh:mm a'),
			}
			console.log("formData==========", formData)
			let doc = programData.instructor_image !== '' ? programData.instructor_image.split(',') : [];
			console.log("doc=============", doc)
			let docnames = [];
			doc.length > 0 && doc.map(d => {
				if (d.includes('jpg') || d.includes('jpeg') || d.includes('png')) {
					let imgs = this.state.images.slice();
					imgs.push(d);
					this.setState({ images: imgs })
				} else {
					docnames.push(d.split('/').pop().split('?')[0]);
				}
				console.log("d.split", d.split('/').pop().split('?')[0])
			})
			let vid = programData.watch_trailer_link !== '' ? programData.watch_trailer_link.split(',') : [];
			vid.length > 0 && vid.map(d => {

				let imgs = this.state.videos.slice();
				imgs.push(d);
				this.setState({ videos: imgs, vdocuments: imgs })
			})


			let vid2 = programData.trailer_link && programData.trailer_link !== '' ? programData.trailer_link.split(',') : [];
			vid2.length > 0 && vid2.map(d => {

				let imgs = this.state.trailer_videos.slice();
				imgs.push(d);
				this.setState({ trailer_videos: imgs, trailer_video_documents: imgs })
			})

			await this.setState({
				formValues: formData,
				// docNames: docnames,
				// documents: doc,
				// customer_id: loadData.customer_id,
				// load_status: loadData.load_status
			})
		}

	}
	changeValuesHandler = async (e) => {

		if (e.target.name == "instructor_description" && e.target.value.length >= 151) {
			// window.alert("skdjhfksjdh")
			return false
		} else {
			console.log(e)
			console.log("state", this.state.formValues)
			var formValues = this.state.formValues;
			var name = e.target.name;
			console.log(name)
			formValues[name] = e.target.value.replace(/^\s+/g, '');

			this.setState({ formValues: formValues });
			console.log("state", this.state.formValues)
		}
	}

	editProgramHandler = async () => {
		let myData = { ...this.state.formValues }
		console.log('start_datetime', moment(this.state.start_datetime).format("YYYY-MM-DD HH:MM:SS"))
		console.log('start_datetime', moment(this.state.start_datetime).format("YYYY-MM-DD HH:mm:ss"))
		// myData.start_datetime = moment(this.state.start_datetime).format("YYYY-MM-DD HH:mm:ss");
		myData.videoImg = videoThumb;
		myData.trailerVideoImg = trailer_video_thumb;
		this.validateFormData(myData, true);
	}
	addProgramHandler = async () => {
		let myData = { ...this.state.formValues }

		console.log('start_datetime', moment(this.state.start_datetime))

		// myData.start_datetime = moment(this.state.start_datetime).format("YYYY-MM-DD HH:mm:ss");
		console.log("mydata", this.state)
		console.log("addProgramHandler >>videoImgvideoImg", videoImg)
		console.log("addProgramHandler >>videoThumb videoThumb", videoThumb)
		myData.videoImg = videoThumb;
		myData.trailerVideoImg = trailer_video_thumb;
		this.validateFormData(myData);
	}


	validateFormData = (body, isOnEdit) => {
		console.log("body========", body)
		isOnEdit ? body.program_id = +this.params.program_id : null
		let schema = joi.object().keys({
			program_duration: joi.string().trim().required(),
			program_level: joi.string().trim().required(),
			program_name: joi.string().trim().required(),
			instructor_expertise: joi.string().trim().required(),
			instructor_description: joi.string().trim().required().label("Program short description"),
			program_overview: joi.string().trim().required(),
			instructor_quote: joi.string().trim().required().label("Quote"),
			quote_by: joi.string().trim().required().label("Writer of Quote"),
			instructor_name: joi.string().trim().required(),
			// start_datetime: joi.string().trim().required(),
			videoImg: joi.any(),
			VideoImg: joi.any(),
			trailerVideoImg: joi.any(),
		})
		let documents = this.state.idocuments;
		let videos = this.state.vdocuments;
		let trailer_videos = this.state.trailer_video_documents;
		console.log('documentsdocuments', documents)
		console.log('videosvideosvideos', videos)
		if (documents.length < 1 && (this.state.images && this.state.images.length < 1)) {
			schema = schema.append({
				image: joi.string().required()
			});
		}
		if (videos.length < 1) {
			schema = schema.append({
				video: joi.string().required(),
			});
		}

		if (trailer_videos.length < 1) {
			schema = schema.append({
				trailer_video: joi.string().required(),
			});
		}

		if (isOnEdit) {
			schema = schema.append({
				program_id: joi.number().required()
			});
		}

		delete body["start_datetime"]
		joi.validate(body, schema, (error, value) => {
			if (error) {
				if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
					let errorLog = common.validateSchema(error)
					this.setState({ error: errorLog.error, errorField: errorLog.errorField });
				}
			}
			else {
				this.setState({ error: '', errorField: '' }, () => {
					isOnEdit ? this.addEditProgramReq(body, true) : this.addEditProgramReq(body);
				});
			}
		})
	}
	addEditProgramReq = async (body, isOnEdit) => {
		console.log('addEditBlogPostReq Body', body)


		let formData = new FormData();
		let documents = this.state.idocuments;
		let videos = this.state.vdocuments;
		let trailer_videos = this.state.trailer_video_documents;

		console.log('documents', documents)
		console.log('videos', videos)
		if (documents.length > 0) {
			for (let doc of documents) {
				formData.append('instructor_image', doc);
			}
		}
		if (videos.length > 0) {
			for (let video of videos) {
				formData.append('watch_trailer_link', video);
			}
		}


		if (trailer_videos.length > 0) {
			for (let video of trailer_videos) {
				formData.append('trailer_link', video);
			}
		}


		if (isOnEdit && deletedDoc.length > 0) {
			for (let dd of deletedDoc) {
				formData.append('deleted_doc', dd)
			}
		}

		formData.append('program_duration', body.program_duration);
		formData.append('videoThumb', body.videoImg);
		// formData.append('trailer_link', body.trailer_video_img);
		formData.append('program_level', body.program_level);
		formData.append('program_name', body.program_name);
		formData.append('instructor_expertise', body.instructor_expertise);
		formData.append('instructor_description', body.instructor_description);
		formData.append('program_overview', body.program_overview);
		formData.append('instructor_quote', body.instructor_quote);
		formData.append('quote_by', body.quote_by);
		formData.append('instructor_name', body.instructor_name);
		// formData.append('start_datetime', body.start_datetime);
		isOnEdit ? formData.append('program_id', body.program_id) : null

		if (isOnEdit) {
			console.log('formData', formData.entries())

			for (var pair of formData.entries()) {
				console.log(pair[0] + ' ======= ' + pair[1]);
			}

			await this.props.editProgramDetails(formData);
			console.log('editBlogPostDetailsData', this.props.editProgramDetailsData.message)
			if (this.props.editProgramDetailsData && this.props.editProgramDetailsData.code === 1) {
				deletedDoc = []
				common.displayLog(1, this.props.editProgramDetailsData.message)
				this.props.history.push('/app/program')
			}
		} else {
			console.log('formData', formData)
			await this.props.addProgramDetails(formData)
			console.log("this.props.addProgramDetailsData", this.props.addProgramDetailsData)
			if (this.props.addProgramDetailsData && this.props.addProgramDetailsData.code === 1) {
				common.displayLog(1, this.props.addProgramDetailsData.message)
				this.props.history.push('/app/program')
			}
		}
	}

	enterPressed = async (event) => {
		var code = event.keyCode || event.which;
		if (code === 13) { //13 is the enter keycode
			// await this.addCarrierHandler()
		}
	}
	goBack = async () => {
		await this.props.history.push('/app/program')
	}
	imageSelectHandler = async (e) => {
		if (e.target.files && e.target.files.length > 0) {
			console.log("e target files===========", e.target.files[0].name)
			console.log("e.target.files[0].type", e.target.files[0].type)
			let doc = this.state.ImageNames.slice();
			let file = this.state.idocuments.slice()
			let images = this.state.images.slice()
			if (file.length >= 1) {
				alert('Please select first image Remove')
				return false;
			}
			if (images.length >= 1) {
				alert('Please select first image Remove')
				return false;
			}
			for (let i = 0; i < e.target.files.length; i++) {
				// if (e.target.files[i].type === 'application/msword' || e.target.files[i].type === 'application/vnd.ms-excel' || e.target.files[i].type === 'application/vnd.ms-powerpoint' || e.target.files[i].type === 'text/plain' || e.target.files[i].type === 'application/pdf' || e.target.files[i].type === 'image/jpg' || e.target.files[i].type === 'image/jpeg' || e.target.files[i].type === 'image/png') {
				if (e.target.files[i].type === 'image/jpg' || e.target.files[i].type === 'image/jpeg' || e.target.files[i].type === 'image/png') {
					let reader = new FileReader();
					reader.onload = (e) => {
						let images = this.state.images.slice()
						images.push(e.target.result)
						this.setState({ images: images });
					};
					reader.readAsDataURL(e.target.files[i]);
				} else {
					// docName = e.target.files[i].name;
					doc.push(e.target.files[i].name)
				}
				// fileName = e.target.files[i]
				file.push(e.target.files[i])
				// }
				// else {
				//     common.displayLog(0, 'Invalid document')
				// }
			}
			// docName !== '' && docName ? doc.push(docName) : null;
			// fileName !== '' && fileName ? file.push(fileName) : null;
			this.setState({ ImageNames: doc, idocuments: file });
		}
	}

	videoSelectHandler = (e) => {

		console.log(e.target.name)
		global_video_key = e.target.name

		if (e.target.files && e.target.files.length > 0) {

			if (e.target.name == 'watch_trailer_video') {

				console.log("watch_trailer_video")
				console.log("e target files===========", e.target.files[0].name)
				console.log("e.target.files[0].type", e.target.files[0].type)
				let doc = this.state.trailer_video_names.slice();
				let file = this.state.trailer_video_documents.slice()
				let videos = this.state.trailer_videos.slice()
				if (file.length >= 1) {
					alert('Please select remove first video ')
					return false;
				}
				if (videos.length >= 1) {
					alert('Please select remove first video ')
					return false;
				}
				console.log('docdocdoc', doc)
				console.log('filefilefile', file)
				console.log('e.target.files', e.target.files)
				for (let i = 0; i < e.target.files.length; i++) {
					if (e.target.files[i].type === 'video/mp4' || e.target.files[i].type === 'image/gif') {
						let reader = new FileReader();
						reader.onload = (e) => {

							let videos = this.state.trailer_videos.slice()
							console.log(videos)
							videos.push(e.target.result)
							this.setState({ trailer_videos: videos });
						};
						reader.readAsDataURL(e.target.files[i]);
						file.push(e.target.files[0])
						this.setState({ trailer_video_names: doc, trailer_video_documents: file });
					}
				}
			} else {

				console.log("e target files===========", e.target.files[0].name)
				console.log("e.target.files[0].type", e.target.files[0].type)
				let doc = this.state.videoNames.slice();
				let file = this.state.vdocuments.slice()
				let videos = this.state.videos.slice()
				if (file.length >= 1) {
					alert('Please select remove first video ')
					return false;
				}
				if (videos.length >= 1) {
					alert('Please select remove first video ')
					return false;
				}
				console.log('docdocdoc', doc)
				console.log('filefilefile', file)
				console.log('e.target.files', e.target.files)
				for (let i = 0; i < e.target.files.length; i++) {
					// if (e.target.files[i].type === 'application/msword' || e.target.files[i].type === 'application/vnd.ms-excel' || e.target.files[i].type === 'application/vnd.ms-powerpoint' || e.target.files[i].type === 'text/plain' || e.target.files[i].type === 'application/pdf' || e.target.files[i].type === 'image/jpg' || e.target.files[i].type === 'image/jpeg' || e.target.files[i].type === 'image/png') {
					if (e.target.files[i].type === 'video/mp4') {
						let reader = new FileReader();
						reader.onload = (e) => {
							// var thimg = document.createElement('img');
							// thimg.src = reader.result;
							// videoImg = thimg
							// console.log('thimgthimgthimg',thimg)
							// this.setState({
							//     videoImg: thimg
							//   })

							let videos = this.state.videos.slice()
							videos.push(e.target.result)
							this.setState({ videos: videos });
						};
						reader.readAsDataURL(e.target.files[i]);
						file.push(e.target.files[0])
						this.setState({ videoNames: doc, vdocuments: file });
					}
					// else {
					//     // docName = e.target.files[i].name;
					//     doc.push(e.target.files[i].name)
					// }
					// fileName = e.target.files[i]

					// }
					// else {
					//     common.displayLog(0, 'Invalid document')
					// }
				}
			}

		}
		console.log('video is---->>>>', e.target.files[0]);
		let file = e.target.files[0];

		if (e.target.name == "watch_trailer_video") {
			this.setState({
				trailer_video: e.target.files[0]
			});
		} else {

			this.setState({
				quiz_video: e.target.files[0]
			});
		}
		var fileReader = new FileReader();
		var img
		if (e.target.files[0] != undefined) {
			if (file.type.match('image')) {
				fileReader.onload = function () {
					var img = document.createElement('img');
					img.src = fileReader.result;

					if (e.target.name == "watch_video_trailer") {
						trailer_video_img = img
					} else {
						videoImg = img
					}
					// document.getElementsByTagName('div')[0].appendChild(videoImg);
				};
				fileReader.readAsDataURL(file);
			} else {
				console.log('ellelelelelelle')
				fileReader.onload = function () {
					var blob = new Blob([fileReader.result], { type: file.type });
					console.log('blob', blob)
					var url = URL.createObjectURL(blob);
					var video = document.createElement('video');
					var timeupdate = function () {
						if (snapImage()) {
							video.removeEventListener('timeupdate', timeupdate);
							video.pause();
						}
					};
					video.addEventListener('loadeddata', function () {
						if (snapImage()) {
							video.removeEventListener('timeupdate', timeupdate);
						}
					});
					var snapImage = function () {
						var canvas = document.createElement('canvas');
						canvas.width = video.videoWidth;
						canvas.height = video.videoHeight;
						canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
						var image = canvas.toDataURL();
						var success = image.length > 100000;
						if (success) {
							console.log("SUCCESS SUCCESS SUCCESS SUCCESS SUCCESS SUCCESS")
							img = document.createElement('img');
							img.src = image;
							img.id = "videoImg";

							if (global_video_key == "watch_trailer_video") {
								trailer_video_img = img
							} else {
								videoImg = img
							}
							// document.getElementsByName('thumbnaildiv')[0].appendChild(videoImg);
							URL.revokeObjectURL(url);
						}

						if (global_video_key == "watch_trailer_video") {
							trailer_video_thumb = image
						} else {
							videoThumb = image
						}
						// console.log('videoThumbvideoThumb', videoThumb)
						return success;
					};
					video.addEventListener('timeupdate', timeupdate);
					video.preload = 'metadata';
					video.src = url;
					// Load video in Safari / IE11
					video.muted = true;
					video.playsInline = true;
					video.play();
				};
				console.log('file----->>>', file);
				fileReader.readAsArrayBuffer(file);
			}


			if (e.target.name == "watch_trailer_video") {
				console.log("1")
				this.setState({
					trailer_video_img: img
				})
			} else {
				console.log("2")
				this.setState({
					videoImg: img
				})
			}
		}
	}


	removeDocument = (index, doc) => {
		doc.includes('https://saviour.s3.amazonaws.com') ? deletedDoc.push(doc) : null;
		let docArr = this.state.docNames.slice();
		let file = this.state.documents.slice();
		docArr.splice(index, 1);
		console.log("files======", file)
		doc.includes('https://saviour.s3.amazonaws.com') ? file.splice(file.findIndex(x => x.includes(doc)), 1) : file.splice(file.findIndex(x => x.name == doc), 1);
		this.setState({ docNames: docArr, documents: file });
	}
	removeImage = (index, img) => {
		// console.log('imgfggggggggggggggggggggg',img)
		// img.includes('https://saviour.s3.amazonaws.com') ? idocuments.push(img) : null;
		let images = [];
		// let images = this.state.images.slice();

		// let file = this.state.documents.slice();
		let file = [];
		// images.splice(index, 1)
		// img.includes('https://saviour.s3.amazonaws.com') ? file.splice(file.findIndex(x => x.includes(img)), 1) : file.splice(file.findIndex(x => x.name == img), 1);
		this.setState({ images: images, idocuments: file, ImageNames: file })
	}

	removeVideo = (index, vid, type) => {

		if (type == 'trailer') {
			this.setState({ trailer_videos: [], trailer_video_documents: [], trailer_video_names: [] });
		} else {
			// console.log('vidvidvidvidvid',vid)
			// img.includes('https://saviour.s3.amazonaws.com') ? deletedDoc.push(vid) : null;
			let images = [];
			// let images = this.state.images.slice();

			// let file = this.state.documents.slice();
			let file = [];
			// images.splice(index, 1)
			// img.includes('https://saviour.s3.amazonaws.com') ? file.splice(file.findIndex(x => x.includes(img)), 1) : file.splice(file.findIndex(x => x.name == img), 1);
			this.setState({ videos: images, vdocuments: file, videoNames: file })
		}
	}

	closeForm = () => {
		this.setState({ showForm: false })
	}

	onEditorStateChange = async (editorState) => {

		let editorSourceHTML = draftToHtml(convertToRaw(editorState.getCurrentContent())),
			editorSourceHTMLRow = convertToRaw(editorState.getCurrentContent()).blocks[0].text

		this.setState({
			editorState: editorState,
			formValues: {
				...this.state.formValues,
				instructor_description: editorSourceHTMLRow === "" ? "" : editorSourceHTML
			}
		});
	};


	editorChangeHandler = async (content) => {

		console.log(content.level.content)

		this.setState({
			formValues: {
				...this.state.formValues,
				instructor_description: content.level.content
			}
		});
	}


	render() {
		console.log("this.statethis.state", this.state)
		return (
			<div className="addCarrierMain">
				<Helmet>
					<title>{this.params.program_id ? "Edit Program" : "Add Program"}</title>
					<meta name="description" content="Reactify Widgets" />
				</Helmet>
				<PageTitleBar
					title={<IntlMessages id={this.params.program_id ? "sidebar.editProgram" : "sidebar.addProgram"} />}
					match={this.props.match}
				/>
				<RctCollapsibleCard fullBlock>
					<div className="table-responsive">
						<div className="d-flex justify-content-between border-bottom tableContent">
							<div className="col-sm-12 col-md-12 col-xl-12">
								<Form className='addCarrierForm' >
									<div className='formWrapper'>
										{/* <div className='info-panel d-flex justify-content-center'></div> */}

										<div className="row align-items-start">
											<Col md={6}>
												<FormGroup>
													<Label htmlFor="instructor_name"><span>Instructor Name<em>*</em></span></Label>
													<Input
														type="text"
														name="instructor_name"
														id="instructor_name"
														placeholder="Enter Instructor Name"
														value={this.state.formValues.instructor_name}
														onKeyPress={(e) => this.enterPressed(e)}
														onChange={(e) => this.changeValuesHandler(e)} />
												</FormGroup>
												<FormGroup>
													<Label htmlFor="description"><span>Instructor Image<em>* (Please upload image size of 375*340)</em></span></Label>
													<label className='upload-doc' htmlFor="upload-attachment">
														<img src={require('../../assets/img/upload-file.png')} /></label>
													<input
														type="file"
														name="instructor_image"

														accept="image/*"
														onChange={(e) => this.imageSelectHandler(e)}
														id="upload-attachment" />
												</FormGroup>
												<FormGroup>
													<div className="attachFiles">
														{
															this.state.ImageNames.length > 0 && this.state.ImageNames.map((document, i) =>
																<div className='carrierFile' key={i}>
																	<div className="attacheFileBox d-flex flex-wrap">
																		<div className="pdfBoxMain mt-2 mb-2">
																			<div className="pdfBox"> <img className='pdfImage' src={document && (document.substr(document.lastIndexOf('.') + 1) == 'doc' || document.substr(document.lastIndexOf('.') + 1) == 'docx' ? Images.svg : (document.substr(document.lastIndexOf('.') + 1) == 'pdf' ? Images.pdf : document.substr(document.lastIndexOf('.') + 1) == 'mp4' || document.substr(document.lastIndexOf('.') + 1) == 'MP4' || document.substr(document.lastIndexOf('.') + 1) == 'mov' || document.substr(document.lastIndexOf('.') + 1) == 'MOV' ? Images.video : Images.file))} />
																				<div className="fileDetail d-flex justify-content-between"> <label>{document}<i onClick={() => this.removeDocument(i, document)} className="close-icon ti-close ml-2 mr-2"></i></label></div>
																			</div>
																		</div>
																	</div>
																</div>
															)}
														{
															this.state.images && this.state.images.length > 0 && this.state.images.map((image, i) =>
																<div key={i}>
																	<img className="tag-img" src={image} alt="" title="" />
																	<i onClick={() => this.removeImage(i, image)} className="close-icon ti-close ml-2 mr-2"></i>
																</div>)
														}
													</div>
													<div className='info-panel d-flex justify-content-center'></div>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="instructor_name"><span>Instructor Expertise<em>*</em></span></Label>
													<Input
														type="text"
														name="instructor_expertise"
														id="instructor_expertise"
														placeholder="Enter Instructor Expertise"
														value={this.state.formValues.instructor_expertise}
														onKeyPress={(e) => this.enterPressed(e)}
														onChange={(e) => this.changeValuesHandler(e)} />
												</FormGroup>
												<FormGroup className="CK">
													<Label htmlFor="instructor_description"><span>Program Short Description<em>*</em></span></Label>
													<Input
														type="textarea"
														name="instructor_description"
														id="instructor_description"
														placeholder="Enter Program Short Description"
														value={this.state.formValues.instructor_description}
														onKeyPress={(e) => this.enterPressed(e)}
														onChange={(e) => this.changeValuesHandler(e)} />

													<span className="text-right float-right">{this.state.formValues.instructor_description.length} / 150</span>

													{/* <CKEditor
														config={this.state.CKEditorConfig}
														name="instructor_description"
														data={this.state.formValues.instructor_description}
														onChange={(event, editor) => {
															const data = editor.getData();
															this.changeValuesHandler({ target: { name: 'instructor_description', value: data } })
														}}
													/> */}


													{/* <Editor
														onChange={this.editorChangeHandler}
														initialValue={this.state.formValues.instructor_description}
														init={{
															height: 200,
															menubar: false,
															plugins: [
																'advlist autolink lists link image charmap print preview anchor',
																'searchreplace visualblocks code fullscreen',
																'insertdatetime media table paste code help wordcount fontfamily'
															],
															toolbar: 'undo redo | formatselect fontselect | ' +
																'bold italic backcolor | alignleft aligncenter ' +
																'alignright alignjustify | bullist numlist outdent indent | ' +
																'removeformat | help fontfamily',
															content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
														}}
													/> */}

													{/* <Editor
														name="instructor_description"

														toolbar={{

															options: ['inline', 'blockType', 'list', 'textAlign', 'fontFamily'],

															inline: {
																inDropdown: true,
																options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],

															},
															blockType: {
																inDropdown: true,
																options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],

															},
															fontSize: {
																options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],

															},
															fontFamily: {
																options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
																className: undefined,
																component: undefined,
																dropdownClassName: undefined,
															},
															list: {
																inDropdown: true,
																options: ['unordered', 'ordered'],

															},
															textAlign: {
																inDropdown: true,
																options: ['left', 'center', 'right', 'justify'],
															},

														}
														}

														editorState={this.state.editorState}
														// toolbarClassName="toolbarClassName"
														// wrapperClassName="wrapperClassName"
														// editorClassName="editorClassName"
														onEditorStateChange={this.onEditorStateChange}
													/> */}

												</FormGroup>
												<FormGroup>
													<Label htmlFor="instructor_quote"><span>Program Overview<em>*</em></span></Label>
													<Input
														type="textarea"
														name="program_overview"
														id="program_overview"
														placeholder="Enter Program Overview"
														value={this.state.formValues.program_overview}
														onKeyPress={(e) => this.enterPressed(e)}
														onChange={(e) => this.changeValuesHandler(e)} />
												</FormGroup>
												<FormGroup>
													<Label htmlFor="instructor_quote"><span>Quote<em>*</em></span></Label>
													<Input
														type="textarea"
														name="instructor_quote"
														id="instructor_quote"
														placeholder="Enter Quote"
														value={this.state.formValues.instructor_quote}
														onKeyPress={(e) => this.enterPressed(e)}
														onChange={(e) => this.changeValuesHandler(e)} />
												</FormGroup>

												<FormGroup>
													<Label htmlFor="quote_by"><span>Quote By<em>*</em></span></Label>
													<Input
														type="text"
														name="quote_by"
														id="quote_by"
														placeholder="Enter the name of the writer of the quote"
														value={this.state.formValues.quote_by}
														onKeyPress={(e) => this.enterPressed(e)}
														onChange={(e) => this.changeValuesHandler(e)} />
												</FormGroup>

												<FormGroup>
													<Label htmlFor="program_name"><span>Program Name<em>*</em></span></Label>
													<Input
														type="text"
														name="program_name"
														id="program_name"
														placeholder="Enter Program Name"
														value={this.state.formValues.program_name}
														onKeyPress={(e) => this.enterPressed(e)}
														onChange={(e) => this.changeValuesHandler(e)} />
												</FormGroup>
											</Col>

											<Col md={6}>
												<FormGroup>
													<Label htmlFor="instructor_name"><span>Program Level<em>*</em></span></Label>
													<Input type="select" name='program_level' onChange={(e) => this.changeValuesHandler(e)} value={this.state.formValues.program_level}>
														<option value=''>Select Program Level</option>
														<option value='1'>Beginner</option>
														<option value='2'>Intermediate</option>
														<option value='3'>High</option>
													</Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="program_duration"><span>Program Duration<em>* (Please enter the duration in weeks)</em></span></Label>
													<Input
														type="text"
														name="program_duration"
														id="program_duration"
														placeholder="Enter Program Duration"
														value={this.state.formValues.program_duration}
														onKeyPress={(e) => this.enterPressed(e)}
														onChange={(e) => this.changeValuesHandler(e)} />
												</FormGroup>
												{/* <FormGroup>
													<Label htmlFor="program_duration"><span>Program Start Datetime<em>*</em></span></Label>

													<Datetime
														name="start_datetime"
														id="start_datetime"
														onChange={this.changeDateTime}
														value={this.state.formValues.start_datetime}
														dateFormat={'DD-MM-YYYY'}
														closeOnSelect={true} />
												</FormGroup> */}
												<FormGroup>
													<Label htmlFor="description"><span>Watch Video<em>* (Please upload max 85MB video)</em></span></Label>
													<label className='upload-doc' htmlFor="upload-vattachment">
														<img src={require('../../assets/img/upload-file.png')} /></label>
													<input
														type="file"
														name="watch_video"
														accept="video/mp4"
														onChange={(e) => this.videoSelectHandler(e)}
														id="upload-vattachment" />

													<img src={this.state.videoImg}></img>
													<span class="mandatory-field"> Only Mp4 video upload</span>

												</FormGroup>

												<FormGroup>
													<div className="attachFiles">
														{
															this.state.videoNames.length > 0 && this.state.videoNames.map((document, i) =>
																<div className='carrierFile' key={i}>
																	<div className="attacheFileBox d-flex flex-wrap">
																		<div className="pdfBoxMain mt-2 mb-2">
																			<div className="pdfBox"> <img className='pdfImage' src={document && (document.substr(document.lastIndexOf('.') + 1) == 'doc' || document.substr(document.lastIndexOf('.') + 1) == 'docx' ? Images.svg : (document.substr(document.lastIndexOf('.') + 1) == 'pdf' ? Images.pdf : document.substr(document.lastIndexOf('.') + 1) == 'mp4' || document.substr(document.lastIndexOf('.') + 1) == 'MP4' || document.substr(document.lastIndexOf('.') + 1) == 'mov' || document.substr(document.lastIndexOf('.') + 1) == 'MOV' ? Images.video : Images.file))} />
																				<div className="fileDetail d-flex justify-content-between"> <label>{document}<i onClick={() => this.removeVideo(i, document)} className="close-icon ti-close ml-2 mr-2"></i></label></div>
																			</div>
																		</div>
																	</div>
																</div>
															)}
														{
															this.state.videos && this.state.videos.length > 0 && this.state.videos.map((video, i) =>
																<div key={i}>
																	<video className="tag-video" controls>
																		<source src={video} />
																	</video>
																	<i onClick={() => this.removeVideo(i, video)} className="close-icon ti-close ml-2 mr-2"></i>
																</div>)
														}
													</div>
												</FormGroup>




												{/* parth - 10-05-2021*/}

												<FormGroup>
													<Label htmlFor="description"><span>Watch Trailer Video/GIF<em>*</em></span></Label>
													<label className='upload-doc' htmlFor="upload-vattachment2">
														<img src={require('../../assets/img/upload-file.png')} /></label>
													<input
														type="file"
														name="watch_trailer_video"
														accept="video/mp4, image/gif"
														onChange={(e) => this.videoSelectHandler(e)}
														id="upload-vattachment2" />

													<img src={this.state.trailer_video_img}></img>
													<span class="mandatory-field"> Only Mp4 video upload</span>

												</FormGroup>

												<FormGroup>
													<div className="attachFiles">
														{
															this.state.trailer_video_names.length > 0 && this.state.trailer_video_names.map((document, i) =>
																<div className='carrierFile' key={i}>
																	<div className="attacheFileBox d-flex flex-wrap">
																		<div className="pdfBoxMain mt-2 mb-2">
																			<div className="pdfBox"> <img className='pdfImage' src={document && (document.substr(document.lastIndexOf('.') + 1) == 'doc' || document.substr(document.lastIndexOf('.') + 1) == 'docx' ? Images.svg : (document.substr(document.lastIndexOf('.') + 1) == 'pdf' ? Images.pdf : document.substr(document.lastIndexOf('.') + 1) == 'mp4' || document.substr(document.lastIndexOf('.') + 1) == 'MP4' || document.substr(document.lastIndexOf('.') + 1) == 'mov' || document.substr(document.lastIndexOf('.') + 1) == 'MOV' ? Images.video : Images.file))} />
																				<div className="fileDetail d-flex justify-content-between"> <label>{document}<i onClick={() => this.removeVideo(i, document, 'trailer')} className="close-icon ti-close ml-2 mr-2"></i></label></div>
																			</div>
																		</div>
																	</div>
																</div>
															)}
														{
															this.state.trailer_videos && this.state.trailer_videos.length > 0 && this.state.trailer_videos.map((video, i) =>
																<div key={i}>
																	{
																		String(video).includes("gif") ?
																			<img className="tag-video" src={video} />
																			:
																			<video className="tag-video" controls>
																				<source src={video} />
																			</video>
																	}
																	<i onClick={() => this.removeVideo(i, video, 'trailer')} className="close-icon ti-close ml-2 mr-2"></i>

																</div>)
														}
													</div>
												</FormGroup>

												{/* ------------------ */}





											</Col>
										</div>


									</div>


									{
										this.state.error !== '' ?
											<Alert color="danger">
												{this.state.error}
											</Alert>
											: null
									}
									<p><em style={{ color: '#c35151' }}>*</em><span className='mandatory-field'> SHOWS MANDATORY FIELDS</span></p>
									<hr />
									{
										this.params.program_id ?
											<Button variant="contained" className="text-white btn-primary mr-2" onClick={this.editProgramHandler}>Update</Button> :
											<Button variant="contained" className="text-white btn-primary mr-2" onClick={this.addProgramHandler}>Add</Button>
									}
									<Button variant="contained" className="text-white btn-danger" onClick={this.goBack}>Cancel</Button>
								</Form>
							</div>
						</div>
					</div>
				</RctCollapsibleCard>
			</div >
		);
	}
}
// map state to props
const mapStateToProps = ({ programReducer }) => {
	const { addProgramDetailsData, getAllProgramByIdData, editProgramDetailsData } = programReducer;
	return { addProgramDetailsData, getAllProgramByIdData, editProgramDetailsData }
}

export default connect(mapStateToProps, {
	addProgramDetails,
	getAllProgramListById,
	editProgramDetails
})(AddEditProgram);
