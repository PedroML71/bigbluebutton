import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import UserListService from '/imports/ui/components/user-list/service';
import UserParticipants from './component';
import { meetingIsBreakout } from '/imports/ui/components/app/service';
import data from '/imports/ui/components/media/container';
import VideoService from '/imports/ui/components/video-provider/service';

const { usersVideo } = data;
const streams = VideoService.getVideoStreams();
const UserParticipantsContainer = props => <UserParticipants {...props} usersVideo={usersVideo} />;

export default withTracker(() => ({
  users: UserListService.getUsers(),
  meetingIsBreakout: meetingIsBreakout(),
  usersVideo,
  streams,
}))(UserParticipantsContainer);
