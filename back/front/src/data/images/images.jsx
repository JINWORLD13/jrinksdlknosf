import React from 'react';

// 정적 경로로 타로 카드 이미지 파일 목록 정의 (해싱 없이 직접 참조)
const tarotCardImageFiles = [
  '00_The_Fool.jpg',
  '01_The_Magician.jpg',
  '02_The_High_Priestess.jpg',
  '03_The_Empress.jpg',
  '04_The_Emperor.jpg',
  '05_The_Hierophant.jpg',
  '06_The_Lovers.jpg',
  '07_The_Chariot.jpg',
  '08_Strength.jpg',
  '09_The_Hermit.jpg',
  '10_Wheel_of_Fortune.jpg',
  '11_Justice.jpg',
  '12_The_Hanged_Man.jpg',
  '13_Death.jpg',
  '14_Temperance.jpg',
  '15_The_Devil.jpg',
  '16_The_Tower.jpg',
  '17_The_Star.jpg',
  '18_The_Moon.jpg',
  '19_The_Sun.jpg',
  '20_Judgement.jpg',
  '21_The_World.jpg',
  '22_Ace_of_Wands.jpg',
  '23_Two_of_Wands.jpg',
  '24_Three_of_Wands.jpg',
  '25_Four_of_Wands.jpg',
  '26_Five_of_Wands.jpg',
  '27_Six_of_Wands.jpg',
  '28_Seven_of_Wands.jpg',
  '29_Eight_of_Wands.jpg',
  '30_Nine_of_Wands.jpg',
  '31_Ten_of_Wands.jpg',
  '32_Page_of_Wands.jpg',
  '33_Knight_of_Wands.jpg',
  '34_Queen_of_Wands.jpg',
  '35_King_of_Wands.jpg',
  '36_Ace_of_Cups.jpg',
  '37_Two_of_Cups.jpg',
  '38_Three_of_Cups.jpg',
  '39_Four_of_Cups.jpg',
  '40_Five_of_Cups.jpg',
  '41_Six_of_Cups.jpg',
  '42_Seven_of_Cups.jpg',
  '43_Eight_of_Cups.jpg',
  '44_Nine_of_Cups.jpg',
  '45_Ten_of_Cups.jpg',
  '46_Page_of_Cups.jpg',
  '47_Knight_of_Cups.jpg',
  '48_Queen_of_Cups.jpg',
  '49_King_of_Cups.jpg',
  '50_Ace_of_Swords.jpg',
  '51_Two_of_Swords.jpg',
  '52_Three_of_Swords.jpg',
  '53_Four_of_Swords.jpg',
  '54_Five_of_Swords.jpg',
  '55_Six_of_Swords.jpg',
  '56_Seven_of_Swords.jpg',
  '57_Eight_of_Swords.jpg',
  '58_Nine_of_Swords.jpg',
  '59_Ten_of_Swords.jpg',
  '60_Page_of_Swords.jpg',
  '61_Knight_of_Swords.jpg',
  '62_Queen_of_Swords.jpg',
  '63_King_of_Swords.jpg',
  '64_Ace_of_Pentacles.jpg',
  '65_Two_of_Pentacles.jpg',
  '66_Three_of_Pentacles.jpg',
  '67_Four_of_Pentacles.jpg',
  '68_Five_of_Pentacles.jpg',
  '69_Six_of_Pentacles.jpg',
  '70_Seven_of_Pentacles.jpg',
  '71_Eight_of_Pentacles.jpg',
  '72_Nine_of_Pentacles.jpg',
  '73_Ten_of_Pentacles.jpg',
  '74_Page_of_Pentacles.jpg',
  '75_Knight_of_Pentacles.jpg',
  '76_Queen_of_Pentacles.jpg',
  '77_King_of_Pentacles.jpg',
];

// & tarotDeck의 카드파일별 파일명(카드명 앞에 숫자도 있음. jpg는 없앰.)과 일치시킴.
export const tarotCardImageFilesList = tarotCardImageFiles.map(fileName => {
  return fileName.split('.')[0];
});
export const tarotCardImageFilesNameList = tarotCardImageFiles.map(fileName => {
  return fileName.split('.')[0].split('_').slice(1).join('_');
});

// 정적 경로로 이미지 파일 경로 생성
export const tarotCardImageFilesPathList = tarotCardImageFiles.map(fileName => {
  return `/assets/images/deck/${fileName}`;
});

export const tarotCardImageFileFolderPath = '/assets/images/deck';

export const backImagePath = '/assets/images/tarot_card_back.jpg';
