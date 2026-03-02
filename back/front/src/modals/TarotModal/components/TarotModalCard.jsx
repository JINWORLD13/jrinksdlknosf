import React from 'react';
import Card from '../../../components/common/Card';

export const TarotModalCard = ({ styles, ...props }) => {
  return (
    <>
      {/* Cosmic background layer behind modal */}
      <div className={styles['cosmic-background-overlay']}></div>

      <Card className={`${styles['tarot-modal']} ${props.className}`}>
        {props.children}
      </Card>
    </>
  );
};
