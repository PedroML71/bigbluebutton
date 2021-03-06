import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import cx from 'classnames';
import { withModalMounter } from '/imports/ui/components/modal/service';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import getFromUserSettings from '/imports/ui/services/users-settings';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Icon from '../icon/component';
import { styles } from './styles.scss';
import Button from '../button/component';
import RecordingIndicator from './recording-indicator/container';
import TalkingIndicatorContainer from '/imports/ui/components/nav-bar/talking-indicator/container';
import SettingsDropdownContainer from './settings-dropdown/container';
import UserOptionsContainer from '../user-list/user-list-content/user-participants/user-options/container';

const intlMessages = defineMessages({
  toggleUserListLabel: {
    id: 'app.navBar.userListToggleBtnLabel',
    description: 'Toggle button label',
  },
  toggleUserListAria: {
    id: 'app.navBar.toggleUserList.ariaLabel',
    description: 'description of the lists inside the userlist',
  },
  newMessages: {
    id: 'app.navBar.toggleUserList.newMessages',
    description: 'label for toggleUserList btn when showing red notification',
  },
});

const propTypes = {
  amIModerator: PropTypes.bool,
  // presentationTitle: PropTypes.string,
  hasUnreadMessages: PropTypes.bool,
  meetingIsBreakout: PropTypes.bool,
  intl: intlShape.isRequired,
  isExpanded: PropTypes.bool,
  setEmojiStatus: PropTypes.func.isRequired,
  shortcuts: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const defaultProps = {
  amIModerator: true,
  // presentationTitle: 'Default Room Title',
  hasUnreadMessages: false,
  meetingIsBreakout: false,
  isExpanded: true,
  shortcuts: '',
};

class NavBar extends PureComponent {
  static handleToggleUserList() {
    Session.set(
      'openPanel',
      Session.get('openPanel') !== ''
        ? ''
        : 'userlist',
    );
    Session.set('idChatOpen', '');
  }

  componentDidMount() {
    const {
      processOutsideToggleRecording,
      connectRecordingObserver,
    } = this.props;

    if (Meteor.settings.public.allowOutsideCommands.toggleRecording
      || getFromUserSettings('bbb_outside_toggle_recording', false)) {
      connectRecordingObserver();
      window.addEventListener('message', processOutsideToggleRecording);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {
      hasUnreadMessages,
      isExpanded,
      intl,
      shortcuts: TOGGLE_USERLIST_AK,
      mountModal,
      // presentationTitle,
      amIModerator,
      users,
      meetingIsBreakout,
      setEmojiStatus,
    } = this.props;


    const toggleBtnClasses = {};
    toggleBtnClasses[styles.btn] = true;
    toggleBtnClasses[styles.btnWithNotificationDot] = hasUnreadMessages;

    let ariaLabel = intl.formatMessage(intlMessages.toggleUserListAria);
    ariaLabel += hasUnreadMessages ? (` ${intl.formatMessage(intlMessages.newMessages)}`) : '';


    return (
      <div className={styles.navbar}>
        <div className={styles.top}>
          <div className={styles.left}>
            {!isExpanded ? null
              : <Icon iconName="left_arrow" className={styles.arrowLeft} />
            }

            <Button
              data-test="userListToggleButton"
              onClick={NavBar.handleToggleUserList}
              ghost
              circle
              hideLabel
              label={intl.formatMessage(intlMessages.toggleUserListLabel)}
              aria-label={ariaLabel}
              icon="user"
              className={cx(toggleBtnClasses)}
              aria-expanded={isExpanded}
              accessKey={TOGGLE_USERLIST_AK}
            />

            {isExpanded ? null
              : <Icon iconName="right_arrow" className={styles.arrowRight} />
            }
          </div>
          <div className={styles.center}>
            <h1 className={styles.presentationTitle}>BBB</h1>

            <RecordingIndicator
              mountModal={mountModal}
              amIModerator={amIModerator}
            />
          </div>
          <div className={styles.right}>
            <SettingsDropdownContainer amIModerator={amIModerator} />
          </div>
        </div>
        {!amIModerator ? null
          : (
            <UserOptionsContainer
              users={users}
              setEmojiStatus={setEmojiStatus}
              meetingIsBreakout={meetingIsBreakout}
              intl={intl}
            />
          )
        }
        <div className={styles.bottom}>
          <TalkingIndicatorContainer amIModerator={amIModerator} />
        </div>
      </div>
    );
  }
}

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;
export default withShortcutHelper(withModalMounter(injectIntl(NavBar)), 'toggleUserList');
