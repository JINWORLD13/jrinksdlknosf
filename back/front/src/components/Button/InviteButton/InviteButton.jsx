import React, { useRef } from 'react';
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();
import { useSelector } from 'react-redux';
import { isDevelopmentMode } from '@/utils/constants';
import styles from './InviteButton.module.scss';

export const InviteButton = ({
  isToken,
  isClickedForInvite,
  setClickedForInvite,
  onOpenInvite,
  ...props
}) => {
  const isWaitingForRedux = useSelector(state => state.booleanStore.isWaiting);
  const isAnsweredForRedux = useSelector(
    state => state.booleanStore.isAnswered
  );

  const handleClick = async e => {
    try {
      if (isClickedForInvite) return;
      setClickedForInvite(true);
      onOpenInvite();
    } catch (err) {
      if (isDevelopmentMode) {
        console.log(err);
      }
    } finally {
      setClickedForInvite(false);
    }
  };

  const inviteButton = useRef(null);

  return (
    <div
      className={styles['invite']}
      onClick={handleClick}
      ref={inviteButton}
    >
    </div>
  );
};






















