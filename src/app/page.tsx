"use client";

import { useMemo, useState } from "react";

const PROVINCES = [
  "عمالة طنجة-أصيلا","عمالة الرباط","إقليم فاس","إقليم مراكش",
  "إقليم أكادير إداوتنان","عمالة وجدة-أنكاد","أخرى"
];

const COMMUNES = ["طنجة-أصيلا","الرباط","فاس","مراكش","أكادير","وجدة","أخرى"];

const SLOTS = [
  { id: "slotA", label: "الأربعاء 22 أكتوبر 2025 · 18:30–19:30 (Africa/Casablanca)" },
  { id: "slotB", label: "الخميس 23 أكتوبر 2025 · 12:30–13:30 (Africa/Casablanca)" },
  { id: "slotC", label: "لا أستطيع في هذه المواعيد — أخبروني بالموعد القادم" }
];

type Row = {
  ts: string; province: string; cso_name: string; contact_name: string; email: string;
  phone: string; commune: string; other_commune: string; interests: string;
  slot: string; notes: string; consent: boolean;
};

function exportCSV(rows: Row[], filename = "registrations.csv") {
  const header = [
    "timestamp","province","cso_name","contact_name","email","phone",
    "commune","other_commune","interests","slot","notes","consent"
  ].join(",");

  const body = rows
    .map(r => [
      r.ts,
      JSON.stringify(r.province || ""),
      JSON.stringify(r.cso_name || ""),
      JSON.stringify(r.contact_name || ""),
      JSON.stringify(r.email || ""),
      JSON.stringify(r.phone || ""),
      JSON.stringify(r.commune || ""),
      JSON.stringify(r.other_commune || ""),
      JSON.stringify(r.interests || ""),
      JSON.stringify(r.slot || ""),
      JSON.stringify(r.notes || ""),
      r.consent ? "yes" : "no"
    ].join(","))
    .join("\n");

  const csv = [header, body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename; document.body.appendChild(link);
  link.click(); document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);

  const [province, setProvince] = useState(PROVINCES[0]);
  const [cso_name, setCSOName] = useState("");
  const [contact_name, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [commune, setCommune] = useState(COMMUNES[0]);
  const [other_commune, setOtherCommune] = useState("");
  const [interests, setInterests] = useState("");
  const [slot, setSlot] = useState(SLOTS[0].id);
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const slotLabel = useMemo(() => SLOTS.find(s => s.id === slot)?.label || "", [slot]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cso_name || !email || !consent) return;
    const entry: Row = {
      ts: new Date().toISOString(),
      province, cso_name, contact_name, email, phone,
      commune, other_commune, interests, slot: slotLabel, notes, consent
    };
    setRows(prev => [entry, ...prev]);
    setSubmitted(true);
    setCSOName(""); setContactName(""); setEmail(""); setPhone("");
    setOtherCommune(""); setNotes(""); setConsent(false);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="sticky top-0 bg-white/70 backdrop-blur border-b py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">المرحلة أ • بقيادة المجتمع المدني</div>
            <h1 className="font-semibold text-lg">حوار التعليم – IFD و REMACTO</h1>
          </div>
          <span className="inline-flex items-center rounded-xl border px-3 py-1 text-sm">المغرب · 2025</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Roadmap + Provinces */}
        <div className="space-y-6">
          <section className="border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">المرحلة أ · خريطة طريق مبسطة</h2>
                <p className="text-sm text-gray-600">قابلة للتطوير خلال الويبينار الأول</p>
              </div>
              <span>🗓️</span>
            </div>
            <ol className="relative border-r pr-4 mt-4 space-y-4">
              {[
                { t: "الإعلان وتهيئة المشاركين", w: "15–21 أكتوبر", d: "نشر الدعوة للمشاركة، فتح تسجيل الجمعيات، ومشاركة سياسات الشفافية والحماية." },
                { t: "سباق البيانات الأساسية", w: "22–28 أكتوبر", d: "تجميع حِزَم خط الأساس لكل عمالة/إقليم (البنية، الموارد البشرية، النتائج التعليمية، ملخص الميزانية)." },
                { t: "ويبينار التصميم المشترك #1", w: "22 أو 23 أكتوبر", d: "جلسة مُيسَّرة لتحديد الأولويات وصياغة قالب الحِزم المحلية للإصلاح (LRPs-CSO)." },
                { t: "السبرنت 1 (محلي)", w: "29 أكتوبر – 11 نونبر", d: "تنفيذ جلسات الاستماع والنماذج الأولية في فضاءات العمالات/الأقاليم التجريبية." }
              ].map((it, i) => (
                <li key={i} className="mr-2">
                  <div className="absolute -right-1.5 w-3 h-3 rounded-full bg-black mt-1.5" />
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{it.t}</p>
                    <span className="text-xs border rounded px-2 py-0.5">{it.w}</span>
                  </div>
                  <p className="text-sm text-gray-600">{it.d}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">فضاءات على مستوى العمالات/الأقاليم</h2>
                <p className="text-sm text-gray-600">سنُنشئ مجموعات محلية للحوار داخل كل عمالة/إقليم</p>
              </div>
              <span>📍</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {PROVINCES.map(p => (
                <span key={p} className="text-center border rounded-xl py-2 text-sm">{p}</span>
              ))}
            </div>
          </section>

          <section className="border rounded-2xl p-4 text-sm text-gray-700">
            <h3 className="font-semibold text-lg mb-2">حول المرحلة أ</h3>
            <p>ننشئ فضاءات للحوار على مستوى <strong>العمالات/الأقاليم</strong> لملاءمة الحوكمة القطاعية للتعليم، مع وصلها بمبادرات الجماعات لاحقاً.</p>
            <p className="mt-1">سيصمم الويبينار الأول الخطوات التالية ويعتمد قالب الحِزم المحلية للإصلاح (LRPs-CSO) ودفتر “العرض المفتوح”.</p>
          </section>
        </div>

        {/* Registration */}
        <section className="border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">سجّل منظمتك في الويبينار الأول</h2>
              <p className="text-sm text-gray-600">استمارة واحدة لكل منظمة. سنرسل رابط الحضور والبرنامج عبر البريد.</p>
            </div>
            <span>👥</span>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <div className="space-y-3">
              <label className="block text-sm">العمالة/الإقليم <span className="text-red-600">*</span></label>
              <select className="w-full border rounded-xl px-3 py-2"
                      value={province} onChange={e => setProvince(e.target.value)}>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm">اسم الجمعية/المنظمة <span className="text-red-600">*</span></label>
                <input className="w-full border rounded-xl px-3 py-2" value={cso_name}
                       onChange={e => setCSOName(e.target.value)} placeholder="مثال: Impact For Development" required />
              </div>
              <div className="space-y-1">
                <label className="block text-sm">الشخص المسؤول</label>
                <input className="w-full border rounded-xl px-3 py-2" value={contact_name}
                       onChange={e => setContactName(e.target.value)} placeholder="الاسم الكامل" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm">البريد الإلكتروني <span className="text-red-600">*</span></label>
                <input type="email" className="w-full border rounded-xl px-3 py-2" value={email}
                       onChange={e => setEmail(e.target.value)} placeholder="name@example.org" required />
              </div>
              <div className="space-y-1">
                <label className="block text-sm">الهاتف</label>
                <input className="w-full border rounded-xl px-3 py-2" value={phone}
                       onChange={e => setPhone(e.target.value)} placeholder="+212…" />
              </div>

              <div className="space-y-1">
                <label className="block text-sm">الجماعة (اختياري)</label>
                <select className="w-full border rounded-xl px-3 py-2"
                        value={commune} onChange={e => setCommune(e.target.value)}>
                  {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {commune === "أخرى" && (
                <div className="space-y-1">
                  <label className="block text-sm">جماعة أخرى</label>
                  <input className="w-full border rounded-xl px-3 py-2"
                         value={other_commune} onChange={e => setOtherCommune(e.target.value)}
                         placeholder="اكتب اسم الجماعة" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm">مجالات الاهتمام (اختياري)</label>
              <textarea className="w-full border rounded-xl px-3 py-2" rows={3}
                        value={interests} onChange={e => setInterests(e.target.value)}
                        placeholder="مثال: الصحة المدرسية، النقل الآمن، شفافية التوظيف" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm">الحصة المفضلة</label>
              <div className="space-y-2">
                {SLOTS.map(s => (
                  <label key={s.id} className="flex items-center gap-2 border rounded-xl p-2">
                    <input type="radio" name="slot" value={s.id}
                      checked={slot === s.id} onChange={() => setSlot(s.id)} />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm">ملاحظات (اختياري)</label>
              <textarea className="w-full border rounded-xl px-3 py-2" rows={3}
                        value={notes} onChange={e => setNotes(e.target.value)}
                        placeholder="أي متطلبات أو ملاحظات (لغة، وصول… إلخ)" />
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
              <span>أوافق على التواصل معي بخصوص هذا الحوار وأقبل إشعار الخصوصية. <span className="text-red-600">*</span></span>
            </label>

            <div className="flex items-center gap-3">
              <button className="border rounded-xl px-4 py-2 bg-black text-white disabled:opacity-50"
                      type="submit" disabled={!cso_name || !email || !consent}>تسجيل</button>
              {submitted && <span className="text-sm text-gray-600">شكراً! تم تسجيل منظمتكم — سنتواصل عبر البريد قريباً.</span>}
            </div>
          </form>
        </section>
      </div>

      {/* Registered table */}
      <section className="border rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">المنظمات المسجَّلة (عرض محلي)</h3>
          <button className="border rounded-xl px-3 py-1 text-sm"
                  onClick={() => exportCSV(rows)}>تصدير CSV</button>
        </div>
        <div className="overflow-x-auto mt-3">
          {rows.length === 0 ? (
            <p className="text-sm text-gray-600">لا توجد تسجيلات بعد.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right border-b">
                  <th className="py-2">التاريخ</th>
                  <th>العمالة/الإقليم</th>
                  <th>المنظمة</th>
                  <th>البريد</th>
                  <th>الجماعة</th>
                  <th>الحصة</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{r.ts}</td>
                    <td>{r.province}</td>
                    <td className="font-medium">{r.cso_name}</td>
                    <td>{r.email}</td>
                    <td>{r.commune === "أخرى" ? r.other_commune : r.commune}</td>
                    <td>{r.slot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <p className="text-xs text-gray-600 text-right">مُصمَّم للمرحلة أ (بقيادة المجتمع المدني). يمكن لاحقاً ربط النموذج بقاعدة بيانات و إرسال تأكيدات بالبريد، وفتح فضاءات لكل عمالة/إقليم.</p>
    </main>
  );
}
