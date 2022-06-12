// routes
import Dashboard from 'Routes/dashboard';
import Users from 'Routes/users';
import AddUser from 'Routes/addEditUser';
import UserDetails from 'Routes/userDetails';
import BlogPost from 'Routes/blogPost';
import AddEditBlogPost from 'Routes/addEditBlogPost';
import BlogPostDetails from 'Routes/blogPostDetails';
import Bulletin from 'Routes/bulletin';
import AddEditBulletin from 'Routes/addEditBulletin';
import BulletinDetails from 'Routes/bulletinDetails';
import Program from 'Routes/program';
import AddEditProgram from 'Routes/addEditProgram';
import ProgramDetails from 'Routes/programDetails';
import AppoinmentDetails from 'Routes/appoinmentDetails';
import Commitments from 'Routes/commitments';
import AddEditCommitment from 'Routes/addEditCommitment';
import addEditSupportingMaterial from 'Routes/addEditSupportingMaterial';
import AddEditAppointement from 'Routes/addEditAppointement';
import ProgramFeedback from 'Routes/programFeedback';
import Pages from 'Routes/pages';
import AddEditPage from 'Routes/addEditPage';
import Settings from 'Routes/settings';
import SupportFeedback from 'Routes/feedback-support'

export default [
   {
      path: 'dashboard',
      component: Dashboard,
      exact: true
   },
   {
      path: 'users',
      component: Users,
      exact: true
   },
   {
      path: 'user-details',
      component: UserDetails,
      exact: true
   },
   {
      path: 'user/add-user',
      component: AddUser,
      exact: true
   },
   {
      path: 'blog-post',
      component: BlogPost,
      exact: true
   },
   {
      path: 'blog-post/add-blog-post',
      component: AddEditBlogPost,
      exact: true
   },
   {
      path: 'blog-post/blog-post-details',
      component: BlogPostDetails,
      exact: true
   },
   {
      path: 'blog-post/edit-blog-post',
      component: AddEditBlogPost,
      exact: true
   },
   {
      path: 'program',
      component: Program,
      exact: true
   },
   {
      path: 'program/add-program',
      component: AddEditProgram,
      exact: true
   },
   {
      path: 'program/detail-program',
      component: ProgramDetails,
      exact: true
   },
   {
      path: 'program/edit-program',
      component: AddEditProgram,
      exact: true
   },
   {
      path: 'program/stages',
      component: Commitments,
      exact: true
   },
   {
      path: 'program/stages/add-stage',
      component: AddEditCommitment,
      exact: true
   },
   {
      path: 'program/stages/edit-stage',
      component: AddEditCommitment,
      exact: true
   },
   {
      path: 'program/stages/add-material',
      component: addEditSupportingMaterial,
      exact: true
   },
   {
      path: 'program/stages/edit-material',
      component: addEditSupportingMaterial,
      exact: true
   },
   {
      path: 'program/appoinment-details',
      component: AppoinmentDetails,
      exact: true
   },
   {
      path: 'program/feedback',
      component: ProgramFeedback,
      exact: true
   },
   {
      path: 'appointement',
      component: Program,
      exact: true
   },
   {
      path: 'appointement/add-appointement',
      component: AddEditAppointement,
      exact: true
   },
   {
      path: 'program/appointement/edit-appointement',
      component: AddEditAppointement,
      exact: true
   },
   {
      path: 'bulletin',
      component: Bulletin,
      exact: true
   },
   {
      path: 'bulletin/add-bulletin',
      component: AddEditBulletin,
      exact: true
   },
   {
      path: 'bulletin/bulletin-details',
      component: BulletinDetails,
      exact: true
   },
   {
      path: 'bulletin/edit-bulletin',
      component: AddEditBulletin,
      exact: true
   },
   {
      path: 'pages/add-page',
      component: AddEditPage,
      exact: true
   },
   {
      path: 'pages/edit-page',
      component: AddEditPage,
      exact: true
   },
   {
      path: 'pages',
      component: Pages,
      exact: true
   },
   {
      path: 'settings',
      component: Settings,
      exact: true
   },
   {
      path: 'support_feedback',
      component: SupportFeedback,
      exact: true
   }
]