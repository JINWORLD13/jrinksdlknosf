import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { getCounsleeInfo, setCounsleeInfo, clearCounsleeInfo, normalizeLanguageForStorage } from '@/utils/storage/counsleeInfoStorage';
import { userApi } from '@/api/userApi';
import { useModalBackHandler } from '@/contexts/ModalBackHandlerContext';
import styles from './ClientInfoModal.module.scss';

const initialForm = {
  name: '',
  birthDate: '',
  gender: '',
  nationality: '',
  referenceNote: '',
};

/** 리딩 시 참고 내용 글자 수 제한: 일반 500자 */
const REFERENCE_NOTE_MAX_LENGTH_DEFAULT = 500;
/** 해당 이메일만 1500자 허용 (환경변수 VITE_REFERENCE_NOTE_EXTENDED_EMAIL) */
const REFERENCE_NOTE_EXTENDED_EMAIL = (
  import.meta.env.VITE_REFERENCE_NOTE_EXTENDED_EMAIL || ''
).trim().toLowerCase();
const REFERENCE_NOTE_MAX_LENGTH_EXTENDED = 1500;

/**
 * 내담자 정보 모달
 * - 저장하면 입력창에 그대로 유지, 같은 폼에서 수정·재저장 가능
 * - 로컬 저장 후 백그라운드에서 DB 동기화
 * - userEmail로 계정별 로컬 키 구분
 */
const ClientInfoModal = ({ isOpen, onClose, onSaved, userEmail = '' }) => {
  const { t, i18n } = useTranslation();
  const { registerModal, unregisterModal } = useModalBackHandler();
  const [form, setForm] = useState(initialForm);
  const [savedHint, setSavedHint] = useState(false);
  const [deletedHint, setDeletedHint] = useState(false);

  const referenceNoteMaxLength =
    userEmail === REFERENCE_NOTE_EXTENDED_EMAIL
      ? REFERENCE_NOTE_MAX_LENGTH_EXTENDED
      : REFERENCE_NOTE_MAX_LENGTH_DEFAULT;

  const loadSaved = useCallback(async () => {
    const lang = normalizeLanguageForStorage(i18n.language);
    const saved = await getCounsleeInfo(userEmail, lang);
    setForm({ ...initialForm, ...saved });
  }, [userEmail, i18n.language]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    loadSaved();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, loadSaved]);

  // ESC 키·디바이스 뒤로가기 → 닫기와 동일
  useEffect(() => {
    if (!isOpen) return;
    const modalId = 'client-info-modal';
    registerModal(modalId, onClose);
    return () => unregisterModal(modalId);
  }, [isOpen, onClose, registerModal, unregisterModal]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value ?? '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const lang = normalizeLanguageForStorage(i18n.language);
    await setCounsleeInfo(form, userEmail, lang);
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 2000);
    onSaved?.(form);
    // 백그라운드 DB 동기화 (계정별·언어별로 병합 저장)
    try {
      await userApi.modify({ counsleeInfo: { [lang]: form } });
    } catch (err) {
      // 무시: 다음에 다시 시도하거나, 타로 요청 시 payload로 전달됨
    }
  };

  const handleDeleteAll = async () => {
    const lang = normalizeLanguageForStorage(i18n.language);
    await clearCounsleeInfo(userEmail, lang);
    setForm(initialForm);
    setDeletedHint(true);
    setTimeout(() => setDeletedHint(false), 2000);
    onSaved?.(initialForm);
    try {
      await userApi.modify({ counsleeInfo: { [lang]: initialForm } });
    } catch (err) {
      // 무시
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.root}>
      <div
        className={styles.backdrop}
        onClick={onClose}
        onTouchStart={onClose}
        aria-hidden="true"
      />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-info-title"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeIcon}
          onClick={onClose}
          aria-label={t('common.close')}
        >
          <X size={22} strokeWidth={2} aria-hidden />
        </button>
        <h2 id="client-info-title" className={styles.title}>
          {t('clientInfo.title')}
        </h2>
        <p className={styles.subtitle}>
          {t('clientInfo.subtitle')}
        </p>

        <form onSubmit={handleSave} className={styles.form}>
          <label className={styles.label}>
            {t('clientInfo.name')}
            <input
              type="text"
              className={styles.input}
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder={t('clientInfo.namePlaceholder')}
              autoComplete="name"
            />
          </label>

          <label className={styles.label}>
            {t('clientInfo.birthDate')}{' '}
            <span className={styles.dateInputWrap}>
              <input
                type="date"
                className={`${styles.input} ${!form.birthDate ? styles.dateInputEmpty : ''}`}
                value={form.birthDate}
                onChange={e => handleChange('birthDate', e.target.value)}
                min="1900-01-01"
                max={new Date().toISOString().slice(0, 10)}   
              />
              {!form.birthDate && (
                <span
                  className={styles.datePlaceholderOverlay}
                  aria-hidden="true"
                  key={i18n.language}
                >
                  {t('clientInfo.birthDateFormat')}
                </span>
              )}
            </span>
          </label>

          <label className={styles.label}>
            {t('clientInfo.gender')}
            <select
              className={styles.select}
              value={form.gender}
              onChange={e => handleChange('gender', e.target.value)}
            >
              <option value="">{t('clientInfo.genderNone', '선택 안 함')}</option>
              <option value="male">{t('clientInfo.genderMale', '남성')}</option>
              <option value="female">{t('clientInfo.genderFemale', '여성')}</option>
            </select>
          </label>

          <label className={styles.label}>
            {t('clientInfo.nationality')}
            <input
              type="text"
              className={styles.input}
              value={form.nationality}
              onChange={e => handleChange('nationality', e.target.value)}
              placeholder={t('clientInfo.nationalityPlaceholder', '선택')}
            />
          </label>

          <label className={styles.label}>
            {t('clientInfo.referenceNote')}
            <span className={styles.exampleHint}>
              {t('clientInfo.referenceNoteExample', '예: 직장을 옮긴 지 3개월 됐어요. 요즘 인간관계가 고민이에요.')}
            </span>
            <textarea
              className={styles.textarea}
              value={form.referenceNote}
              onChange={e => handleChange('referenceNote', e.target.value)}
              placeholder={t('clientInfo.referenceNotePlaceholder')}
              rows={4}
              maxLength={referenceNoteMaxLength}
              aria-describedby="reference-note-count"
            />
            <span id="reference-note-count" className={styles.charCount} aria-live="polite">
              {t('clientInfo.referenceNoteCharCount', {
                count: form.referenceNote.length,
                max: referenceNoteMaxLength,
              })}
            </span>
          </label>

          <div className={styles.actions}>
            <button type="submit" className={styles.save}>
              {t('clientInfo.save')}
            </button>
            <button
              type="button"
              className={styles.deleteAll}
              onClick={handleDeleteAll}
              aria-label={t('clientInfo.deleteAll')}
            >
              {t('clientInfo.deleteAll')}
            </button>
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label={t('common.close')}
            >
              {t('common.close')}
            </button>
            {savedHint && (
              <span className={styles.savedHint} aria-live="polite">
                {t('clientInfo.saved')}
              </span>
            )}
            {deletedHint && (
              <span className={styles.deletedHint} aria-live="polite">
                {t('clientInfo.deleted')}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientInfoModal;
