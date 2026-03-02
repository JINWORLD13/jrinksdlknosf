import React, { useState, useEffect } from 'react';
import styles from '../../styles/scss/SpreadLayoutDefinitions.module.scss';
import flipStyles from '../../styles/scss/CardFlipInteraction.module.scss';
import Card from '../common/Card.jsx';
import {
  backImagePath,
  tarotCardImageFileFolderPath,
  tarotCardImageFilesList,
  tarotCardImageFilesPathList,
} from '../../data/images/images.jsx';
import { useSelectedTarotCards } from '@/hooks';

const TarotCardTableForm = () => {
  return (
    <>
      <div className={styles['table-form-container']}>
        <div>
          <SpreadCase title={'Single Card'}>
            <SingleCard />
          </SpreadCase>
          <SpreadCase title={'Two Cards'}>
            <TwoCards />
          </SpreadCase>
          <SpreadCase title={'Three Cards'}>
            <ThreeCards />
          </SpreadCase>
        </div>
        <div>
          <SpreadCase title={'Past, Present, Future'}>
            <ThreeCardsTime />
          </SpreadCase>
          <SpreadCase title={'Four Cards'}>
            <FourCards />
          </SpreadCase>
          <SpreadCase title={'Celtic Cross'}>
            <CelticCross />
          </SpreadCase>
        </div>
      </div>
    </>
  );
};

export default TarotCardTableForm;

export const SpreadCase = props => {
  return (
    <>
      <Card className={styles['spread-container']}>
        <div className={styles['spread-box']}>{props.children}</div>
        <div>{props.title}</div>
      </Card>
    </>
  );
};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const SingleCard = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem?.split(' (')[0] ?? null,
      reversed:
        elem?.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-single-answer']
    : spreadModal
    ? styles['card-single-spread']
    : styles['card-single-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        {selectedTarotCards?.length === 1 ? (
          <>
            <TarotCardFront
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </>
        )}
      </div>
    </>
  );
};
export const TwoCards = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-two-answer']
    : spreadModal
    ? styles['card-two-spread']
    : styles['card-two-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        {selectedTarotCards?.length === 2 ? (
          <>
            <TarotCardFront
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </>
        )}
      </div>
    </>
  );
};
export const TwoCardsBinaryChoice = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-two-answer']
    : spreadModal
    ? styles['card-two-spread']
    : styles['card-two-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        {selectedTarotCards?.length === 2 ? (
          <>
            <TarotCardFront
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </>
        )}
      </div>
    </>
  );
};
export const ThreeCards = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-three-answer']
    : spreadModal
    ? styles['card-three-spread']
    : styles['card-three-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        {selectedTarotCards?.length === 3 ? (
          <>
            <TarotCardFront
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </>
        )}
      </div>
    </>
  );
};
export const ThreeCardsTime = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;

  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-three-answer']
    : spreadModal
    ? styles['card-three-spread']
    : styles['card-three-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        {selectedTarotCards?.length === 3 ? (
          <>
            <TarotCardFront
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </>
        )}
      </div>
    </>
  );
};
export const ThreeCardsSolution = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;

  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-three-answer']
    : spreadModal
    ? styles['card-three-spread']
    : styles['card-three-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        {selectedTarotCards?.length === 3 ? (
          <>
            <TarotCardFront
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </>
        )}
      </div>
    </>
  );
};
export const ThreeCardsADay = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;

  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-three-answer']
    : spreadModal
    ? styles['card-three-spread']
    : styles['card-three-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        {selectedTarotCards?.length === 3 ? (
          <>
            <TarotCardFront
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </>
        )}
      </div>
    </>
  );
};
export const ThreeCardsThreeWayChoice = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;

  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-three-answer']
    : spreadModal
    ? styles['card-three-spread']
    : styles['card-three-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        {selectedTarotCards?.length === 3 ? (
          <>
            <TarotCardFront
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </>
        )}
      </div>
    </>
  );
};
export const FourCards = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-four-answer']
    : spreadModal
    ? styles['card-four-spread']
    : styles['card-four-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        {selectedTarotCards?.length === 4 ? (
          <>
            <TarotCardFront
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </>
        )}
      </div>
    </>
  );
};
export const FiveCardsRelationship = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-five-answer']
    : spreadModal
    ? styles['card-five-spread']
    : styles['card-five-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        {selectedTarotCards?.length === 5 ? (
          <>
            <TarotCardFrontForFiveCardsRelationship
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <div>
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            </div>
            <div>
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            </div>
            <div>
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            </div>
          </>
        )}
      </div>
    </>
  );
};
export const SixCardsSixPeriods = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  return (
    <>
      <div
        className={`${
          answerModal
            ? styles['card-six-answer']
            : spreadModal
            ? styles['card-six-spread']
            : styles['card-six-answer']
        } ${spreadModal} ${answerModal}`}
      >
        {selectedTarotCards?.length === 6 ? (
          <>
            <TarotCardFront
              className={`${answerModal}`}
              readingConfig={readingConfig}
              selectedCardPosition={props?.selectedCardPosition}
              setSelectedCardPosition={props?.setSelectedCardPosition}
            />
          </>
        ) : (
          <>
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </>
        )}
      </div>
    </>
  );
};

// ! 스피드타로용 스프레드.
export const CelticCross = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig?.selectedTarotCardsArr?.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const [isClicked, setIsClicked] = useState(false);
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;

  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];

  const imagePathByName = cardName => {
    if (selectedTarotCards?.length !== 0) {
      const foundCardFileName = tarotCardImageFilesList?.find(indexNumber => {
        return indexNumber?.split('_').slice(1).join(' ') === cardName;
      });
      return tarotCardImageFileFolderPath + '/' + foundCardFileName + '.jpg';
    }
  };

  const cards =
    selectedTarotCards?.map((card, i) => {
      return (
        <div
          key={i}
          className={`${answerModal} ${
            card?.reversed === true
              ? flipStyles['front-for-answer-modal-reversed']
              : null
          }`}
          onClick={e => {
            setIsClicked(true);
            props?.setSelectedCardPosition(prev => {
              return { isClicked: true, position: i + 1 };
            });
          }}
        >
          <img
            src={imagePathByName(card?.name)}
            alt="front"
            draggable={false}
          />
        </div>
      );
    }) ?? Array(10).fill(<div style={{ backgroundColor: 'white' }} />);
  //& 리액트에서 상태업데이트는 전부 비동기이므로 처리 전에 렌더됨. 그래도 빨리 처리하니 오류남. 처음부터 back으로 갖다 놓고 클릭으로 뒤집어도, 뒤집으면 빠지는게 있음..
  //! css로 클릭하면 뒤집는 것으로 처리하려고 하는데, 문제가 있다. 그리드 셀을 relative로 두고 그 위에도 relative 하고 absolute 두개 놓는데 겹치지 않는다. 그런데 가운데 카드가 말썽이라 별로다.
  // ? 알고보니 특정 카드가 reversed 되면 고정적으로 렌더가 되지 않는다.....css의 rotate를 X, Z로 해보니 렌더가 되는데;;
  return (
    <>
      <div
        className={`${styles['card-celtic-cross-container']} ${spreadModal} ${answerModal}`}
      >
        <div
          className={`${styles['card-celtic-cross1']} ${spreadModal} ${answerModal}`}
        >
          {selectedTarotCards?.length === 10 && isClicked ? (
            <>
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              {cards[4]}
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              {cards[3]}
              <div
                className={`${styles['card-celtic-cross1-center']} ${spreadModal} ${answerModal}`}
              >
                {cards[0]}
                {cards[1]}
              </div>
              {cards[5]}
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              {cards[2]}
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
            </>
          ) : (
            <>
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              <TarotCardBack
                className={`${spreadModal} ${answerModal}`}
                setIsClicked={setIsClicked}
              />
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              <TarotCardBack
                className={`${spreadModal} ${answerModal}`}
                setIsClicked={setIsClicked}
              />
              <div
                className={`${styles['card-celtic-cross1-center']}  ${spreadModal} ${answerModal}`}
              >
                <TarotCardBack
                  className={`${spreadModal} ${answerModal}`}
                  setIsClicked={setIsClicked}
                />
                <TarotCardBack
                  className={`${spreadModal} ${answerModal}`}
                  setIsClicked={setIsClicked}
                />
              </div>
              <TarotCardBack
                className={`${spreadModal} ${answerModal}`}
                setIsClicked={setIsClicked}
              />
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              <TarotCardBack
                className={`${spreadModal} ${answerModal}`}
                setIsClicked={setIsClicked}
              />
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
            </>
          )}
        </div>
        <div
          className={`${styles['card-celtic-cross2']} ${spreadModal} ${answerModal}`}
        >
          {selectedTarotCards?.length === 10 && isClicked ? (
            <>
              {cards[9]}
              {cards[8]}
              {cards[7]}
              {cards[6]}
            </>
          ) : (
            <>
              <TarotCardBack
                className={`${spreadModal} ${answerModal}`}
                setIsClicked={setIsClicked}
              />
              <TarotCardBack
                className={`${spreadModal} ${answerModal}`}
                setIsClicked={setIsClicked}
              />
              <TarotCardBack
                className={`${spreadModal} ${answerModal}`}
                setIsClicked={setIsClicked}
              />
              <TarotCardBack
                className={`${spreadModal} ${answerModal}`}
                setIsClicked={setIsClicked}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ! 질문타로용 스프레드(동시에 마이페이지 기록용 스프레드)로 쓸 것.(isClicked 없애려고)
export const CelticCrossForAnswer = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig.selectedTarotCardsArr.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];

  const imagePathByName = cardName => {
    if (selectedTarotCards?.length !== 0) {
      const foundCardFileName = tarotCardImageFilesList?.find(indexNumber => {
        return indexNumber?.split('_').slice(1).join(' ') === cardName;
      });
      return tarotCardImageFileFolderPath + '/' + foundCardFileName + '.jpg';
    }
  };

  const cards =
    selectedTarotCards?.map((card, i) => {
      return (
        <div
          key={i}
          className={`${answerModal} ${
            card?.reversed === true
              ? flipStyles['front-for-answer-modal-reversed']
              : null
          }`}
          onClick={e => {
            props?.setSelectedCardPosition(prev => {
              return { isClicked: true, position: i + 1 };
            });
          }}
        >
          <img
            src={imagePathByName(card?.name)}
            alt="front"
            draggable={false}
          />
        </div>
      );
    }) ?? Array(10).fill(<div style={{ backgroundColor: 'white' }} />);

  //& 리액트에서 상태업데이트는 전부 비동기이므로 처리 전에 렌더됨. 그래도 빨리 처리하니 오류남. 처음부터 back으로 갖다 놓고 클릭으로 뒤집어도, 뒤집으면 빠지는게 있음..
  //! css로 클릭하면 뒤집는 것으로 처리하려고 하는데, 문제가 있다. 그리드 셀을 relative로 두고 그 위에도 relative 하고 absolute 두개 놓는데 겹치지 않는다. 그런데 가운데 카드가 말썽이라 별로다.
  // ? 알고보니 특정 카드가 reversed 되면 고정적으로 렌더가 되지 않는다.....css의 rotate를 X, Z로 해보니 렌더가 되는데;;
  return (
    <>
      <div
        className={`${styles['card-celtic-cross-container']} ${spreadModal} ${answerModal}`}
      >
        <div
          className={`${styles['card-celtic-cross1']} ${spreadModal} ${answerModal}`}
        >
          {selectedTarotCards?.length === 10 ? (
            <>
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              {cards[4]}
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              {cards[3]}
              <div
                className={`${styles['card-celtic-cross1-center']} ${spreadModal} ${answerModal}`}
              >
                {cards[0]}
                {cards[1]}
              </div>
              {cards[5]}
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              {cards[2]}
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
            </>
          ) : (
            <>
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <div
                className={`${styles['card-celtic-cross1-center']}  ${spreadModal} ${answerModal}`}
              >
                <TarotCardBack className={`${spreadModal} ${answerModal}`} />
                <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              </div>
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <div className={`${spreadModal} ${answerModal} empty-cell`} />
            </>
          )}
        </div>
        <div
          className={`${styles['card-celtic-cross2']} ${spreadModal} ${answerModal}`}
        >
          {selectedTarotCards?.length === 10 ? (
            <>
              {cards[9]}
              {cards[8]}
              {cards[7]}
              {cards[6]}
            </>
          ) : (
            <>
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ! 임시(flip용)
export const CelticCrossForSpread = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const selectedTarotCardsArr = props?.readingConfig.selectedTarotCardsArr.map(
    elem => {
      return {
        name: elem.split(' (')[0] ?? null,
        reversed:
          elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
      };
    }
  );
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;
  const totalCardsNumber =
    props?.readingConfig?.cardCount || selectedTarotCardsArr?.length || 10;
  const handleFlip = selectedCardIndex => {
    props?.updateCardForm({
      ...props?.cardForm,
      flippedIndex: [...props?.cardForm?.flippedIndex, selectedCardIndex],
    });
  };
  const imagePath = index => {
    if (selectedTarotCards?.length !== 0) {
      const foundIndex = tarotCardImageFilesList.findIndex(
        indexNumber =>
          indexNumber.split('.')[0] === selectedTarotCards[index]['file_name']
      );
      return tarotCardImageFilesPathList[foundIndex];
    }
  };
  const isCardClicked = selectedCardIndex =>
    props?.cardForm?.flippedIndex.includes(selectedCardIndex) &&
    selectedTarotCards?.length === totalCardsNumber;

  let totalCardsNumberList = [];
  for (let i = 0; i < totalCardsNumber; i++) {
    totalCardsNumberList?.push(i);
  }
  const imagePathByName = cardName => {
    if (selectedTarotCards?.length !== 0) {
      const foundCardFileName = tarotCardImageFilesList?.find(indexNumber => {
        return indexNumber?.split('_').slice(1).join(' ') === cardName;
      });
      return tarotCardImageFileFolderPath + '/' + foundCardFileName + '.jpg';
    }
  };

  // & 테스트 후 지우기
  const cards = totalCardsNumberList?.map(indexNumber => {
    return (
      <>
        <div
          className={`${flipStyles['flip-table']} ${
            isCardClicked(selectedTarotCards[indexNumber]?.index)
              ? flipStyles['flip-click']
              : ''
          }`}
          onClick={() => {
            if (selectedTarotCards?.length === totalCardsNumber) {
              handleFlip(selectedTarotCards[indexNumber]?.index);
            }
          }}
        >
          {selectedTarotCards?.length >= indexNumber + 1 ? (
            <>
              {/* <div className={flipStyles['back-table']}>
                <img
                  src={'/assets/images/tarot_card_back.jpg'}
                  alt="back"
                  draggable={false}
                />
              </div> */}
              <div
                className={`${flipStyles['front']} ${
                  selectedTarotCards[indexNumber]?.reversed === true
                    ? flipStyles['front-reversed']
                    : null
                }`}
                onClick={e => {
                  setIsClicked(true);
                  props?.setSelectedCardPosition(prev => {
                    return { isClicked: true, position: indexNumber + 1 };
                  });
                }}
              >
                <img
                  src={imagePath(indexNumber)}
                  alt="front"
                  draggable={false}
                />
              </div>
            </>
          ) : null}
        </div>
      </>
    );
  });

  return (
    <>
      <div className={styles['card-celtic-cross-container']}>
        <div
          className={`${styles['card-celtic-cross1']} ${spreadModal} ${answerModal}`}
        >
          {selectedTarotCards?.length >= 0 ? (
            <>
              <div />
              {cards[4] ?? null}
              <div />
              {cards[3] ?? null}
              <div className={`${styles['card-celtic-cross1-center']}`}>
                {cards[0] ?? null}
                {cards[1] ?? null}
              </div>
              {cards[5] ?? null}
              <div />
              {cards[2] ?? null}
              <div />
            </>
          ) : (
            <>
              <div />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <div />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <div
                className={`${styles['card-celtic-cross1-center']}  ${spreadModal} ${answerModal}`}
              >
                <TarotCardBack className={`${spreadModal} ${answerModal}`} />
                <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              </div>
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <div />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <div />
            </>
          )}
        </div>
        <div
          className={`${styles['card-celtic-cross2']} ${spreadModal} ${answerModal}`}
        >
          {selectedTarotCards?.length >= 0 ? (
            <>
              {cards[9] ?? null}
              {cards[8] ?? null}
              {cards[7] ?? null}
              {cards[6] ?? null}
            </>
          ) : (
            <>
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
              <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

// & Spread Modal용 스프레드

export const SingleCardForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-single-answer']
    : spreadModal
    ? styles['card-single-spread']
    : styles['card-single-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
      </div>
    </>
  );
};
export const TwoCardsForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-two-answer']
    : spreadModal
    ? styles['card-two-spread']
    : styles['card-two-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
      </div>
    </>
  );
};
export const TwoCardsBinaryChoiceForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-two-answer']
    : spreadModal
    ? styles['card-two-spread']
    : styles['card-two-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
      </div>
    </>
  );
};
export const ThreeCardsForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-three-answer']
    : spreadModal
    ? styles['card-three-spread']
    : styles['card-three-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
      </div>
    </>
  );
};
export const ThreeCardsTimeForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-three-answer']
    : spreadModal
    ? styles['card-three-spread']
    : styles['card-three-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
      </div>
    </>
  );
};
export const ThreeCardsSolutionForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-three-answer']
    : spreadModal
    ? styles['card-three-spread']
    : styles['card-three-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
      </div>
    </>
  );
};
export const ThreeCardsADayForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-three-answer']
    : spreadModal
    ? styles['card-three-spread']
    : styles['card-three-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
      </div>
    </>
  );
};
export const ThreeCardsThreeWayChoiceForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-three-answer']
    : spreadModal
    ? styles['card-three-spread']
    : styles['card-three-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
      </div>
    </>
  );
};
export const FourCardsForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-four-answer']
    : spreadModal
    ? styles['card-four-spread']
    : styles['card-four-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        <TarotCardBack className={`${spreadModal} ${answerModal}`} />
      </div>
    </>
  );
};

export const FiveCardsRelationshipForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  const cardClass = answerModal
    ? styles['card-five-answer']
    : spreadModal
    ? styles['card-five-spread']
    : styles['card-five-answer']; // Default to answer
  return (
    <>
      <div className={cardClass}>
        <div>
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        </div>
        <div>
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        </div>
        <div>
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        </div>
      </div>
    </>
  );
};

export const SixCardsTimesForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];
  return (
    <>
      <div className={`${styles['card-six-spread-box']}`}>
        <div
          className={`${
            answerModal
              ? styles['card-six-answer']
              : spreadModal
              ? styles['card-six-spread']
              : styles['card-six-answer']
          } ${spreadModal} ${answerModal}`}
        >
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        </div>
      </div>
    </>
  );
};

export const CelticCrossForModal = ({ ...props }) => {
  const spreadModal =
    props?.className === 'spread-modal' && styles['spread-modal'];
  const answerModal =
    props?.className === 'answer-modal' && styles['answer-modal'];

  return (
    <>
      <div
        className={`${styles['card-celtic-cross-container']} ${spreadModal} ${answerModal}`}
      >
        <div
          className={`${styles['card-celtic-cross1']} ${spreadModal} ${answerModal}`}
        >
          <div
            className={`${spreadModal} ${answerModal}`}
            style={{ opacity: 0, pointerEvents: 'none' }}
          />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <div
            className={`${spreadModal} ${answerModal}`}
            style={{ opacity: 0, pointerEvents: 'none' }}
          />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <div
            className={`${styles['card-celtic-cross1-center']}  ${spreadModal} ${answerModal}`}
          >
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
            <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          </div>
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <div
            className={`${spreadModal} ${answerModal}`}
            style={{ opacity: 0, pointerEvents: 'none' }}
          />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <div
            className={`${spreadModal} ${answerModal}`}
            style={{ opacity: 0, pointerEvents: 'none' }}
          />
        </div>
        <div
          className={`${styles['card-celtic-cross2']} ${spreadModal} ${answerModal}`}
        >
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
          <TarotCardBack className={`${spreadModal} ${answerModal}`} />
        </div>
      </div>
    </>
  );
};

export const TarotCardBack = props => {
  return (
    <>
      <div
        className={`${styles['card-back']} ${props?.className}`}
        onClick={() => {
          props?.setIsClicked(true);
        }}
      >
        <img src={backImagePath} alt="back" draggable={false} />
      </div>
    </>
  );
};

export const TarotCardFront = ({ readingConfig, ...props }) => {
  const selectedTarotCardsArr = readingConfig.selectedTarotCardsArr.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed: elem.split(' (')[1].split(')')[0] === 'reversed' ? true : false,
    };
  });
  const fetchedSelectedCards = useSelectedTarotCards();
  // readingConfig를 우선적으로 사용 (두루마기와 일치시키기 위함)
  const selectedTarotCards =
    selectedTarotCardsArr && selectedTarotCardsArr?.length > 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;

  const imagePathByName = cardName => {
    if (selectedTarotCards?.length !== 0) {
      const foundCardFileName = tarotCardImageFilesList?.find(indexNumber => {
        return indexNumber?.split('_').slice(1).join(' ') === cardName;
      });
      return tarotCardImageFileFolderPath + '/' + foundCardFileName + '.jpg';
    }
  };
  const cards = selectedTarotCards?.map((card, i) => {
    // 1장 스프레드인 경우 blink modal 표시하지 않음
    const isSingleCardSpread = readingConfig?.spreadListNumber === 100;
    return (
      <div
        key={i}
        className={`${props?.className} ${
          card?.reversed === true
            ? flipStyles['front-for-answer-modal-reversed']
            : null
        }`}
        onClick={e => {
          // 1장 스프레드가 아닌 경우에만 blink modal 표시
          if (!isSingleCardSpread && props?.setSelectedCardPosition) {
            props?.setSelectedCardPosition(prev => {
              return { isClicked: true, position: i + 1 };
            });
          }
        }}
      >
        <img src={imagePathByName(card?.name)} alt="front" draggable={false} />
      </div>
    );
  });
  return <>{cards}</>;
};

export const TarotCardFrontForFiveCardsRelationship = ({
  readingConfig,
  ...props
}) => {
  const selectedTarotCardsArr = readingConfig.selectedTarotCardsArr.map(elem => {
    return {
      name: elem.split(' (')[0] ?? null,
      reversed:
        elem.split(' (')[1]?.split(')')[0] === 'reversed' ? true : false,
    };
  });

  const fetchedSelectedCards = useSelectedTarotCards();
  const selectedTarotCards =
    fetchedSelectedCards === null ||
    fetchedSelectedCards === undefined ||
    fetchedSelectedCards?.length === 0
      ? selectedTarotCardsArr
      : fetchedSelectedCards;

  const imagePathByName = cardName => {
    if (selectedTarotCards?.length !== 0) {
      const foundCardFileName = tarotCardImageFilesList?.find(indexNumber => {
        return indexNumber?.split('_').slice(1).join(' ') === cardName;
      });
      return tarotCardImageFileFolderPath + '/' + foundCardFileName + '.jpg';
    }
  };

  const renderCard = (card, index) => (
    <div
      key={index}
      className={`${props?.className} ${
        card?.reversed === true
          ? flipStyles['front-for-answer-modal-reversed']
          : null
      }`}
      onClick={e => {
        props?.setSelectedCardPosition(prev => {
          return { isClicked: true, position: index + 1 };
        });
      }}
    >
      <img src={imagePathByName(card?.name)} alt="front" draggable={false} />
    </div>
  );

  return (
    <>
      <div>
        {selectedTarotCards?.slice(0, 2).map((card, i) => renderCard(card, i))}
      </div>
      <div>
        {selectedTarotCards
          ?.slice(2, 4)
          .map((card, i) => renderCard(card, i + 2))}
      </div>
      <div>
        {selectedTarotCards?.[4] && renderCard(selectedTarotCards[4], 4)}
      </div>
    </>
  );
};
