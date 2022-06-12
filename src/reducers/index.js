/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import sidebarReducer from './SidebarReducer';
import settingsReducer from './settings';
import adminAuthReducer from './AdminAuthReducer';
import userReducer from './UserReducer';
import blogPostReducer from './BlogPostReducer';
import pageReducer from './PageReducer';
import bulletinReducer from './BulletinReducer';
import programReducer from './ProgramReducer';
import appointementReducer from './AppointementReducer';
import SettingsReducer from './SettingsReducer'
import CommitmentReducer from './CommitmentReducer'
import FeedbackSupportReducer from './FeedbackSupportReducer'

const reducers = combineReducers({
   sidebar: sidebarReducer,
   adminAuthReducer: adminAuthReducer,
   settings: settingsReducer,
   userReducer: userReducer,
   blogPostReducer: blogPostReducer,
   programReducer: programReducer,
   appointementReducer: appointementReducer,
   pageReducer: pageReducer,
   bulletinReducer: bulletinReducer,
   SettingsReducer: SettingsReducer,
   CommitmentReducer: CommitmentReducer,
   FeedbackSupportReducer: FeedbackSupportReducer
});

export default reducers;
