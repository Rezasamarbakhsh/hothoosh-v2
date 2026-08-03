import { ThemeToggle } from '@/components/theme/theme-toggle';

const primaryShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const typeScaleItems = [
  { token: 'caption-xs', label: 'برچسب بسیار کوچک' },
  { token: 'caption-sm', label: 'برچسب کوچک' },
  { token: 'body-sm', label: 'متن بدنه کوچک' },
  { token: 'body-md', label: 'متن بدنه پیش‌فرض' },
  { token: 'body-lg', label: 'متن بدنه بزرگ' },
  { token: 'heading-sm', label: 'عنوان کوچک' },
  { token: 'heading-md', label: 'عنوان متوسط' },
  { token: 'heading-lg', label: 'عنوان بزرگ' },
  { token: 'heading-xl', label: 'عنوان بسیار بزرگ' },
  { token: 'heading-2xl', label: 'عنوان نمایشی' },
];

const glassTiers = [
  {
    name: 'glass-panel-solid',
    label: 'سطح ساختاری',
    desc: 'نوار کناری، نوار بالا — شفافیت بالا',
    className: 'glass-panel-solid rounded-lg',
  },
  {
    name: 'glass-panel-elevated',
    label: 'سطح برجسته',
    desc: 'کارت‌ها، مودال‌ها — شفافیت متوسط',
    className: 'glass-panel-elevated',
  },
  {
    name: 'glass-panel-data',
    label: 'سطح داده',
    desc: 'جداول، کارت‌های آماری — شفافیت بیشتر',
    className: 'glass-panel-data',
  },
  {
    name: 'glass-panel-subtle',
    label: 'سطح ظریف',
    desc: 'هاور، جداکننده‌ها — شفافیت حداکثری',
    className: 'glass-panel-subtle rounded-md',
  },
];

const semanticColors = [
  { name: 'success', token: '--color-success-500', label: 'موفق' },
  { name: 'warning', token: '--color-warning-500', label: 'هشدار' },
  { name: 'error', token: '--color-error-500', label: 'خطا' },
  { name: 'info', token: '--color-info-500', label: 'اطلاعات' },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* Hero */}
      <section className="space-y-3">
        <h1
          className="text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-heading-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            lineHeight: 'var(--leading-heading-2xl)',
            letterSpacing: 'var(--tracking-tight)',
          }}
        >
          هت‌هوش
        </h1>
        <p
          className="text-[var(--color-text-secondary)]"
          style={{
            fontSize: 'var(--text-body-lg)',
            lineHeight: 'var(--leading-body-lg)',
          }}
        >
          فضای کاری هوش مصنوعی سازمانی — فارسی‌اول، راست‌به‌چپ، شیشه‌ای مینیمال
        </p>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-success-100)] px-3 py-1 font-[var(--font-weight-medium)] text-[var(--color-success-600)]"
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-[var(--color-success-500)]"
              aria-hidden="true"
            />
            آماده پیاده‌سازی
          </span>
          <span
            className="text-[var(--color-text-muted)]"
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            فاز ۱۱ — حالت ساخت
          </span>
        </div>
      </section>

      {/* Glass Surfaces */}
      <section className="space-y-4">
        <h2
          className="text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-heading-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--leading-heading-lg)',
          }}
        >
          سطوح شیشه‌ای
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {glassTiers.map((tier) => (
            <div key={tier.name} className={`${tier.className} p-5 space-y-2`}>
              <h3
                className="text-[var(--color-text-primary)]"
                style={{
                  fontSize: 'var(--text-body-lg)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {tier.label}
              </h3>
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: 'var(--text-body-sm)' }}
              >
                {tier.desc}
              </p>
              <code
                className="block text-[var(--color-text-muted)]"
                style={{ fontSize: 'var(--text-mono-sm)' }}
              >
                .{tier.name}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-4">
        <h2
          className="text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-heading-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--leading-heading-lg)',
          }}
        >
          مقیاس تایپوگرافی
        </h2>
        <div className="glass-panel-elevated divide-y divide-[var(--color-border-default)] overflow-hidden">
          {typeScaleItems.map((item) => (
            <div
              key={item.token}
              className="flex items-center justify-between px-5 py-3"
            >
              <span
                className="text-[var(--color-text-primary)]"
                style={{
                  fontSize: `var(--text-${item.token})`,
                  fontWeight:
                    item.token.startsWith('heading') || item.token === 'display'
                      ? 'var(--font-weight-semibold)'
                      : 'var(--font-weight-regular)',
                }}
              >
                {item.label}
              </span>
              <code
                className="shrink-0 text-[var(--color-text-muted)]"
                style={{ fontSize: 'var(--text-mono-sm)' }}
              >
                --text-{item.token}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Colors */}
      <section className="space-y-4">
        <h2
          className="text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-heading-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--leading-heading-lg)',
          }}
        >
          رنگ‌های معنایی
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {semanticColors.map((color) => (
            <div
              key={color.name}
              className="glass-panel-elevated p-4 text-center space-y-3"
            >
              <div
                className="mx-auto h-10 w-10 rounded-full"
                style={{ backgroundColor: `var(${color.token})` }}
                aria-hidden="true"
              />
              <p
                className="text-[var(--color-text-primary)]"
                style={{
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {color.label}
              </p>
              <code
                className="block text-[var(--color-text-muted)]"
                style={{ fontSize: 'var(--text-caption-xs)' }}
              >
                {color.token}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Primary Palette */}
      <section className="space-y-4">
        <h2
          className="text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-heading-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--leading-heading-lg)',
          }}
        >
          پالت اصلی
        </h2>
        <div className="glass-panel-elevated p-5">
          <div className="flex flex-wrap gap-2">
            {primaryShades.map((shade) => (
              <div
                key={shade}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="h-12 w-12 rounded-lg border border-[var(--color-border-default)]"
                  style={{
                    backgroundColor: `var(--color-primary-${shade})`,
                  }}
                />
                <code
                  className="text-[var(--color-text-muted)]"
                  style={{ fontSize: 'var(--text-caption-xs)' }}
                >
                  {shade}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Toggle Demo */}
      <section className="space-y-4">
        <h2
          className="text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-heading-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--leading-heading-lg)',
          }}
        >
          تغییر تم
        </h2>
        <div className="glass-panel-elevated flex items-center justify-between p-5">
          <div>
            <p
              className="text-[var(--color-text-primary)]"
              style={{
                fontSize: 'var(--text-body-md)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              پوسته روشن / تاریک
            </p>
            <p
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              با کلیک روی آیکون، تم تغییر می‌کند
            </p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      {/* RTL Verification */}
      <section className="space-y-4">
        <h2
          className="text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-heading-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--leading-heading-lg)',
          }}
        >
          راست‌به‌چپ
        </h2>
        <div className="glass-panel-elevated space-y-3 p-5">
          <p
            className="text-[var(--color-text-primary)]"
            style={{ fontSize: 'var(--text-body-md)' }}
          >
            این متن به صورت پیش‌فرض از راست به چپ نمایش داده می‌شود. تمام
            ویژگی‌های CSS از خصوصیات منطقی استفاده می‌کنند (inline-start،
            inline-end، ms-، me-، ps-، pe-) و هیچ ویژگی فیزیکی جهت‌دار
            (left، right) در کد وجود ندارد.
          </p>
          <div className="flex gap-2">
            <span className="rounded-md bg-[var(--color-primary-500)] px-3 py-1.5 font-[var(--font-weight-medium)] text-[var(--color-text-inverse)]" style={{ fontSize: 'var(--text-body-sm)' }}>
              دکمه اصلی
            </span>
            <span className="rounded-md border border-[var(--color-border-default)] px-3 py-1.5 font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
              دکمه ثانویه
            </span>
          </div>
          <p
            className="text-[var(--color-text-muted)]"
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            dir=&quot;rtl&quot; در عنصر html تنظیم شده و Vazirmatn به عنوان فونت
            پیش‌فرض بارگذاری شده است.
          </p>
        </div>
      </section>
    </div>
  );
}
