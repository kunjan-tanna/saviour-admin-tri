/*  EDITOR OPTIONS

            toolbar: [
                ['Bold', 'Italic', 'Underline', 'Strike', 'TextColor', 'BGColor', 'RemoveFormat'],
                ['NumberedList', 'BulletedList', 'Outdent', 'Indent'],
                ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                ['SpecialChar', 'Bold', 'Italic', 'Strike', 'Underline'],
                { name: 'document', items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates'] },
                [
                    'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-',
                    'PasteFromWord', 'SpellCheck', 'mkField', 'Undo', 'Redo',
                ],
                '/',
                ['Styles', 'Format', 'Font', 'FontSize', 'Link', 'Image', 'Table', 'HorizontalRule'],
            ]
       
*/
import React, { Component } from 'react';
import {
    Button,
    Label,
    Input,
    FormGroup
} from 'reactstrap';
import { queryCall, mutationCall, displayLog } from '../../utils/common';
import { withApollo } from 'react-apollo';
import config from '../../utils/config';
import store from '../../utils/store';

class Editor extends Component {
    state = {
        editorState: "",
        text: "",
        name: "",
    }

    async componentDidMount() {
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

        await this.getData();
        window.CKEDITOR.replace(this.props.id, configuration);
        window.CKEDITOR.inline(this.props.id);
        // window.CKEDITOR.plugins.addExternal( 'imageresize', '../imageresize-master/plugin', 'plugin.js' );
        window.CKEDITOR.instances[this.props.id].on("change", function () {
            let data = window.CKEDITOR.instances[this.props.id].getData();
            this.setTxt(data);
        }.bind(this));

        window.CKEDITOR.instances[this.props.id].on("fileUploadRequest", function () {
            store.dispatch({
                type: 'START_LOADER'
            })
        }.bind(this));

        window.CKEDITOR.instances[this.props.id].on("fileUploadResponse", function () {
            store.dispatch({
                type: 'STOP_LOADER'
            })
        }.bind(this));
    }

    setTxt = async (data) => {
        await this.setState({ text: data })
    }

    getData = async () => {
        let index = this.props.path.lastIndexOf("/");
        let name = String(this.props.path).substr(index + 1, this.props.path.length);
        let response;
        if (this.props.screen == "2") {
            response = await queryCall(this.props, `
                query getStaticPage($name:String!){
                     getStaticPage(name:$name)
                }
                `, 'getStaticPage', {
                name: "home-seo-screen-2"
            },
            )
        } else {
            response = await queryCall(this.props, `
                query getStaticPage($name:String!){
                     getStaticPage(name:$name)
                }
                `, 'getStaticPage', {
                name: name
            },
            )

        }
        let list = response.data.getStaticPage.data.page_text;
        await this.setState({ text: list }, () => {
        });
    }
    // onChangePolicy = (evt) => {
    //     var newContent = evt.editor.getData();
    //     this.setState({
    //         text: newContent
    //     })
    // }
    onSubmitHandler = async () => {
        let index = this.props.path.lastIndexOf("/");
        let name = String(this.props.path).substr(index + 1, this.props.path.length);
        let reqData = {
            page_text: this.state.text
        }
        if (this.props.screen == "2") {
            reqData['name'] = "home-seo-screen-2"

        } else {
            reqData['name'] = name
        }
        let response = await mutationCall(this.props, reqData,
            `mutation updateStaticPage($name: String!,$page_text:String!){
                updateStaticPage(name:$name,page_text:$page_text)
            }`, 'updateStaticPage')
        if (response && response.data.updateStaticPage.code) {
            displayLog(response.data.updateStaticPage.code, response.data.updateStaticPage.message);
        }
        this.getData();
    }

    demo = () => {
        console.log('YES');
    }
    render() {
        return (
            <>
                <script src="../../"></script>
                <div>
                    <FormGroup>
                        <Input type="textarea" name={this.props.id} id={this.props.id} value={this.state.text} onChange={() => this.onChangePolicy()} />
                    </FormGroup>


                    {/* <CKEditor
                        content={this.state.text}
                        // config={{
                        //     colorButton_colors: '00923E,F8C100,28166F',
                        //     colorButton_enableMore: true,
                        //     colorButton_enableAutomatic: true,
                        //     colorButton_foreStyle: {
                        //         element: 'span',
                        //         styles: { color: '#(color)' }
                        //     }

                        // }}

                        // config={{
                        //     options: [
                        //         'default',
                        //         'Arial, Helvetica, sans-serif',
                        //         'Courier New, Courier, monospace',
                        //         'Georgia, serif',
                        //         'Lucida Sans Unicode, Lucida Grande, sans-serif',
                        //         'Tahoma, Geneva, sans-serif',
                        //         'Times New Roman, Times, serif',
                        //         'Trebuchet MS, Helvetica, sans-serif',
                        //         'Verdana, Geneva, sans-serif'
                        //     ]
                            //     ['Undo', 'Redo'],
                            //     ['PasteFromWord', 'SpellCheck', 'mkField'],
                            //     ['Styles', 'Format', 'Font', 'FontSize'],
                            //     ['Link', 'Image', 'Table', 'HorizontalRule'],
                            //     ['Bold', 'Italic', 'Underline', 'Strike', 'TextColor', 'BGColor', 'RemoveFormat'],
                            //     ['NumberedList', 'BulletedList', 'Outdent', 'Indent'],
                            //     ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
                            //    [ 'SpecialChar', 'Bold', 'Italic', 'Strike', 'Underline',{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }]
                            
                    // }}
                        config={ {
                            toolbarGroups: [
                                { name: 'document', groups: ['mode', 'document', 'doctools'] },
                                { name: 'clipboard', groups: ['clipboard', 'undo'] },
                                { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
                                { name: 'forms', groups: ['forms'] },
                                '/',
                                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                                { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
                                { name: 'links', groups: ['links'] },
                                { name: 'insert', groups: ['insert'] },
                                '/',
                                { name: 'styles', groups: ['styles'] },
                                { name: 'colors', groups: ['colors'] },
                                { name: 'tools', groups: ['tools'] },
                                { name: 'others', groups: ['others'] },
                            ]
                        } }
                        events={{
                        "change": this.onChangePolicy
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        this.setState({ text: data })
                    }} */}
                    {/* /> */}
                </div>
                <Button color="primary" className="secondary black-btn m-2" onClick={this.onSubmitHandler}>Submit</Button>

            </>
        );
    }
}

export default withApollo(Editor);