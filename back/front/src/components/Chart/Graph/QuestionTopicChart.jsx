  import React from 'react';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Pie,
  PieChart,
  Cell,
  Label,
  LabelList,
} from 'recharts';
import styles from './QuestionTopicChart.module.scss';
import {
  colors,
  allPeriodMajorToMinorQuestionTopicData,
  allPeriodMinorCardQuestionTopicData,
  minorColors,
} from '../../../lib/chart/questionTopicChartPeriodData.js';
import { useWindowSizeState } from '@/hooks';
import { useLanguageChange } from '@/hooks';

const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'rgba(26, 10, 46, 0.96)',
    border: '1px solid rgba(139, 92, 246, 0.6)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e9d5ff',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.35)',
    zIndex: '99999',
  },
  itemStyle: { color: '#e9d5ff' },
  labelStyle: { color: '#e9d5ff' },
  wrapperStyle: { outline: 'none', zIndex: 9999 },
};

export const QuestionTopicChart = ({
  tarotHistory,
  questionTopic,
  questionOfTopic,
  date,
  ...props
}) => {
  const browswerLanguage = useLanguageChange();
  const filteredTarotHistory = tarotHistory?.filter((elem, i) => {
    return elem.language === browswerLanguage;
  });
  return (
    <div className={styles['container']}>
      <div className={styles['box']}>
        <AllPeriodMajorToMinorChart
          tarotHistory={filteredTarotHistory}
          questionTopic={questionTopic}
          questionOfTopic={questionOfTopic}
          date={date}
        />
      </div>
      <div className={styles['box']}>
        <AllPeriodMinorCardChart
          tarotHistory={filteredTarotHistory}
          questionTopic={questionTopic}
          questionOfTopic={questionOfTopic}
          date={date}
        />
      </div>
    </div>
  );
};

const AllPeriodMajorToMinorChart = ({
  tarotHistory,
  questionTopic,
  questionOfTopic,
  date,
  ...props
}) => {
  const { windowWidth, windowHeight } = useWindowSizeState();

  const isLandscape = windowHeight < windowWidth;

  return (
    <>
      {windowWidth <= 414 && !isLandscape && (
        <PieChart key={`PieChart`} width={280} height={600}>
          <Tooltip
            allowEscapeViewBox={{ x: true, y: true }}
            contentStyle={tooltipStyle.contentStyle}
            itemStyle={tooltipStyle.itemStyle}
            labelStyle={tooltipStyle.labelStyle}
            wrapperStyle={tooltipStyle.wrapperStyle}
          />
          <Legend
            iconSize={15}
            iconType="circle"
            align="center"
            verticalAlign="bottom"
            layout="vertical"
            wrapperStyle={{ marginBottom: '50px' }}
          />
          {allPeriodMajorToMinorQuestionTopicData(
            tarotHistory,
            questionTopic,
            questionOfTopic,
            date
          ).map((totalCardPeriodDatum, i) => {
            return (
              <Pie
                data={totalCardPeriodDatum}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy={windowWidth > 768 || isLandscape ? '50%' : '35%'}
                innerRadius={35 * i}
                outerRadius={35 + 30 * i}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {totalCardPeriodDatum.map((entry, index) => (
                  <Cell
                key={`cell-${index}`}
                fill={colors[i][index]}
                stroke="rgba(139,92,246,0.5)"
                strokeWidth={1}
              />
                ))}
              </Pie>
            );
          })}
        </PieChart>
      )}
      {windowWidth > 414 && windowWidth <= 768 && !isLandscape && (
        <PieChart key={`PieChart`} width={280} height={600}>
          <Tooltip
            allowEscapeViewBox={{ x: true, y: true }}
            contentStyle={tooltipStyle.contentStyle}
            itemStyle={tooltipStyle.itemStyle}
            labelStyle={tooltipStyle.labelStyle}
            wrapperStyle={tooltipStyle.wrapperStyle}
          />
          <Legend
            iconSize={15}
            iconType="circle"
            align="center"
            verticalAlign="bottom"
            layout="vertical"
            wrapperStyle={{ marginBottom: '50px' }}
          />
          {allPeriodMajorToMinorQuestionTopicData(
            tarotHistory,
            questionTopic,
            questionOfTopic,
            date
          ).map((totalCardPeriodDatum, i) => {
            return (
              <Pie
                data={totalCardPeriodDatum}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy={windowWidth > 768 || isLandscape ? '50%' : '35%'}
                innerRadius={35 * i}
                outerRadius={35 + 30 * i}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {totalCardPeriodDatum.map((entry, index) => (
                  <Cell
                key={`cell-${index}`}
                fill={colors[i][index]}
                stroke="rgba(139,92,246,0.5)"
                strokeWidth={1}
              />
                ))}
              </Pie>
            );
          })}
        </PieChart>
      )}
      {(windowWidth > 768 || isLandscape) && (
        <PieChart key={`PieChart`} width={500} height={270}>
          <Tooltip
            allowEscapeViewBox={{ x: true, y: true }}
            contentStyle={tooltipStyle.contentStyle}
            itemStyle={tooltipStyle.itemStyle}
            labelStyle={tooltipStyle.labelStyle}
            wrapperStyle={tooltipStyle.wrapperStyle}
          />
          <Legend
            iconSize={15}
            iconType="circle"
            align="right"
            verticalAlign="middle"
            layout="vertical"
          />
          {allPeriodMajorToMinorQuestionTopicData(
            tarotHistory,
            questionTopic,
            questionOfTopic,
            date
          ).map((totalCardPeriodDatum, i) => {
            return (
              <Pie
                data={totalCardPeriodDatum}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={35 * i}
                outerRadius={38 + 30 * i}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {totalCardPeriodDatum.map((entry, index) => (
                  <Cell
                key={`cell-${index}`}
                fill={colors[i][index]}
                stroke="rgba(139,92,246,0.5)"
                strokeWidth={1}
              />
                ))}
              </Pie>
            );
          })}
        </PieChart>
      )}
    </>
  );
};

const AllPeriodMinorCardChart = ({
  tarotHistory,
  questionTopic,
  questionOfTopic,
  date,
  ...props
}) => {
  const { windowWidth, windowHeight } = useWindowSizeState();

  return (
    <>
      {allPeriodMinorCardQuestionTopicData(
        tarotHistory,
        questionTopic,
        questionOfTopic,
        date
      ).map((minorCardPeriodDatum, i) => {
        return (
          <>
            <PieChart key={`PieChart-${i}`} width={200} height={230}>
              <Tooltip
            allowEscapeViewBox={{ x: true, y: true }}
            contentStyle={tooltipStyle.contentStyle}
            itemStyle={tooltipStyle.itemStyle}
            labelStyle={tooltipStyle.labelStyle}
            wrapperStyle={tooltipStyle.wrapperStyle}
          />
              <Legend />
              <Pie
                data={minorCardPeriodDatum}
                cx="50%"
                cy={
                  windowWidth > 768 || windowHeight < windowWidth
                    ? '50%'
                    : '50%'
                }
                outerRadius={65}
                labelLine={false}
                label={renderCustomizedLabel1}
              >
                {minorCardPeriodDatum.map((entry, index) => (
                  <Cell
                key={`cell-${index}`}
                fill={minorColors[index]}
                stroke="rgba(139,92,246,0.5)"
                strokeWidth={1}
              />
                ))}
              </Pie>
            </PieChart>
          </>
        );
      })}
    </>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontWeight="600"
      style={{
        textShadow: '0 0 3px #0a0a14, 0 0 5px #0a0a14, 0 1px 3px #0a0a14',
      }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderCustomizedLabel1 = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontWeight="600"
      style={{
        textShadow: '0 0 3px #0a0a14, 0 0 5px #0a0a14, 0 1px 3px #0a0a14',
      }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

//         name: 'Major Cards',
//         Daily: 70,
//         Weekly: 70,
//         Monthly: 70,
//         Total: 70,
//       },
//       {
//         name: 'Minor Cards',
//         Daily: 70,
//         Weekly: 70,
//         Monthly: 70,
//         Total: 65,
//       },
//     ];
//     return (
//       <BarChart width={350} height={250} data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis tickCount={100}/>
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="Total" fill="#8884d8" />
//         <Bar dataKey="Daily" fill="#8dddfa9d" />
//         <Bar dataKey="Weekly" fill="#6d12ca9d" />
//         <Bar dataKey="Monthly" fill="#ca9d" />
//       </BarChart>
//     );
//   };
