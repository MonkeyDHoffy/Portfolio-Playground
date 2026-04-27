import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { SectionLabel } from '../ui/SectionLabel';

const TEAL  = '#3DCFB6';
const PEACH = '#FFB27A';
const LILAC = '#B8A4FF';
const LINE  = 'rgba(255,255,255,0.12)';
const DIM   = 'rgba(255,255,255,0.6)';

type ToastType = 'success' | 'error';
type Toast = { id: number; type: ToastType; message: string };
type FormState = { name: string; email: string; message: string; company: string };
type FormErrors = { name?: string; email?: string; message?: string };
type RunnerSendHighscoreEventDetail = {
  message: string;
  speedMs?: number;
  focusField?: boolean;
  scrollToContact?: boolean;
};

const TOAST_DURATION = 4600;
const API_ENDPOINT = 'https://api.hoffja.de/api/send-mail';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emptyForm = (): FormState => ({ name: '', email: '', message: '', company: '' });

async function submit(payload: Omit<FormState, 'company'> & { company: '' }) {
  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Request failed');
  return res;
}

export function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const typingIntervalRef = useRef<number | null>(null);
  const typingActiveRef = useRef(false);

  const stopTypingAnimation = useCallback(() => {
    if (typingIntervalRef.current !== null) {
      window.clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    typingActiveRef.current = false;
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (type: ToastType, message: string) =>
    setToast({ id: Date.now(), type, message });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'message' && typingActiveRef.current) {
      stopTypingAnimation();
    }
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'name' || name === 'email' || name === 'message') {
      setErrors((prev) => {
        if (name === 'email') {
          if (!value.trim()) return { ...prev, email: undefined };
          return EMAIL_RE.test(value.trim()) ? { ...prev, email: undefined } : prev;
        }
        return { ...prev, [name]: undefined };
      });
    }
  };

  useEffect(() => {
    const onSendHighscore = (event: Event) => {
      const customEvent = event as CustomEvent<RunnerSendHighscoreEventDetail>;
      const detail = customEvent.detail;
      if (!detail?.message) return;

      stopTypingAnimation();
      setForm((prev) => ({ ...prev, message: '' }));

      if (detail.scrollToContact) {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      const fullText = detail.message;
      const speedMs = detail.speedMs ?? 30;
      let i = 0;
      typingActiveRef.current = true;

      typingIntervalRef.current = window.setInterval(() => {
        i += 1;
        const next = fullText.slice(0, i);
        setForm((prev) => ({ ...prev, message: next }));

        if (i >= fullText.length) {
          stopTypingAnimation();
          if (detail.focusField) {
            const textarea = document.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
            textarea?.focus();
            const len = textarea?.value.length ?? 0;
            textarea?.setSelectionRange(len, len);
          }
        }
      }, speedMs);
    };

    window.addEventListener('runner:send-highscore', onSendHighscore as EventListener);
    return () => {
      window.removeEventListener('runner:send-highscore', onSendHighscore as EventListener);
      stopTypingAnimation();
    };
  }, [stopTypingAnimation]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setToast(null);

    if (form.company.trim().length > 0) {
      setSending(false);
      return; // honeypot
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      company: '' as const,
    };

    const nextErrors: FormErrors = {};
    if (!payload.name) nextErrors.name = 'required';
    if (!payload.email) nextErrors.email = 'required';
    else if (!EMAIL_RE.test(payload.email)) nextErrors.email = 'invalid email';
    if (!payload.message) nextErrors.message = 'required';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showToast('error', t('contact.form.error'));
      setSending(false);
      return;
    }

    setErrors({});

    try {
      await submit(payload);
      showToast('success', t('contact.form.success'));
      setForm(emptyForm());
    } catch (err) {
      console.error('Contact form failed', err);
      showToast('error', t('contact.form.error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" style={{ padding: 'clamp(48px, 8vw, 64px) 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div className="contact-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'start',
        }}>
          <div>
            <SectionLabel n={t('contact.index')} text={t('contact.label')} />
            <h2 style={{
              fontSize: 'clamp(40px, 6vw, 88px)', fontWeight: 800, lineHeight: 1,
              letterSpacing: '-0.03em', margin: '0 0 24px',
            }}>
              {t('contact.titleA')}{' '}
              <em style={{
                fontStyle: 'italic', fontWeight: 400,
                background: `linear-gradient(90deg, ${TEAL}, ${LILAC})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{t('contact.titleB')}</em>.
            </h2>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: 'rgba(255,255,255,0.85)', margin: '0 0 32px' }}>
              {t('contact.blurb')}
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate style={{
            display: 'flex', flexDirection: 'column', gap: 18,
            padding: 28,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${LINE}`,
            borderRadius: 20,
          }}>
            <input
              type="text" name="company" value={form.company} onChange={onChange}
              tabIndex={-1} autoComplete="off" aria-hidden="true"
              style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
            />
            <Field
              placeholder={errors.name ?? t('contact.form.namePh')}
              name="name" type="text" value={form.name}
              onChange={onChange} autoComplete="name" required hasError={Boolean(errors.name)}
            />
            <Field
              placeholder={errors.email ?? t('contact.form.emailPh')}
              name="email" type="email" value={form.email}
              onChange={onChange} autoComplete="email" required hasError={Boolean(errors.email)}
            />
            <Field
              placeholder={errors.message ?? t('contact.form.messagePh')}
              name="message" value={form.message}
              onChange={onChange} textarea rows={5} required hasError={Boolean(errors.message)} spellCheck={false}
            />
            <button
              type="submit" disabled={sending}
              className="cta-fx cta-teal"
              style={{
                alignSelf: 'flex-start',
                padding: '14px 28px',
                background: TEAL, color: '#000',
                borderRadius: 999, fontWeight: 700, fontSize: 15,
                border: '2px solid #000',
                boxShadow: '4px 4px 0 #000',
                cursor: sending ? 'wait' : 'pointer',
                opacity: sending ? 0.7 : 1,
              }}
            >
              {sending ? t('contact.form.sending') : t('contact.form.submit')}
            </button>
          </form>
        </div>
      </div>

      {toast && (
        <div
          role={toast.type === 'success' ? 'status' : 'alert'}
          aria-live={toast.type === 'success' ? 'polite' : 'assertive'}
          style={{
            position: 'fixed', bottom: 24, right: 24, maxWidth: 360,
            padding: '16px 20px', paddingRight: 40,
            background: '#16161A',
            border: '2px solid #000',
            borderLeft: `6px solid ${toast.type === 'success' ? TEAL : '#ef4444'}`,
            borderRadius: 14,
            boxShadow: '6px 6px 0 #000',
            zIndex: 100,
            animation: 'vc-toast-in 400ms cubic-bezier(.22,.9,.3,1)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            {toast.type === 'success' ? t('contact.form.statusOk') : t('contact.form.statusErr')}
          </div>
          <div style={{ fontSize: 13, color: DIM, lineHeight: 1.5 }}>{toast.message}</div>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label={t('contact.form.dismiss')}
            style={{
              position: 'absolute', top: 8, right: 12,
              fontSize: 20, lineHeight: 1, color: DIM, background: 'none', border: 'none', cursor: 'pointer',
            }}
          >×</button>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        @keyframes vc-toast-in {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: none;              opacity: 1; }
        }
      `}</style>
    </section>
  );
}

function Field({
  placeholder, name, type = 'text', value, onChange, required, autoComplete, textarea, rows, hasError, spellCheck,
}: {
  placeholder: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  autoComplete?: string;
  textarea?: boolean;
  rows?: number;
  hasError?: boolean;
  spellCheck?: boolean;
}) {
  const base: React.CSSProperties = {
    width: '100%',
    background: hasError ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${hasError ? '#ef4444' : LINE}`,
    borderRadius: 12,
    padding: '14px 16px',
    fontSize: 15,
    color: '#fff',
    fontFamily: 'inherit',
    transition: 'border-color 150ms ease, background 150ms ease',
    outline: 'none',
    resize: 'vertical' as const,
  };
  const common = {
    name, value, onChange, placeholder, required, spellCheck,
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = TEAL;
      e.currentTarget.style.background = 'rgba(61,207,182,0.06)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = hasError ? '#ef4444' : LINE;
      e.currentTarget.style.background = hasError ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)';
    },
  };
  return textarea
    ? <textarea {...common} rows={rows ?? 4} style={{ ...base, minHeight: 130 }} />
    : <input {...common} type={type} autoComplete={autoComplete} style={base} />;
}
