"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "../../components/DashboardLayout";

export default function CreateRepairPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const [form, setForm] = useState({
    printerModel: "",
    serialNumber: "",
    customerId: "",
    address: "",
    issueDesc: "",
    accessoriesPreset: {
      powerCable: false,
      usbCable: false,
      tray: false,
      cartridge: false,
    },
    accessoriesText: "",
    requestDate: new Date().toISOString().slice(0, 16),
    contactPhone: session?.user?.phone || "",
    contactEmail: session?.user?.email || "",
    preferredContact: "phone",
    images: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isAllowed = role === "MEMBER" || role === "SHOP";

  const accessoriesTextComputed = useMemo(() => {
    const items = Object.entries(form.accessoriesPreset)
      .filter(([, v]) => v)
      .map(([k]) => k);
    return [items.join(", "), form.accessoriesText].filter(Boolean).join("; ");
  }, [form.accessoriesPreset, form.accessoriesText]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccessoryToggle = (key) => {
    setForm((prev) => ({
      ...prev,
      accessoriesPreset: { ...prev.accessoriesPreset, [key]: !prev.accessoriesPreset[key] },
    }));
  };

  const handleImages = (files) => {
    const selected = Array.from(files || []);
    const maxFiles = 5;
    const valid = [];
    const newErrors = {};

    for (const f of selected.slice(0, maxFiles)) {
      if (f.size > 5 * 1024 * 1024) {
        newErrors.images = "รูปต้องไม่เกิน 5MB ต่อไฟล์ (สูงสุด 5 รูป)";
        continue;
      }
      if (!/^image\//.test(f.type)) {
        newErrors.images = "อนุญาตเฉพาะไฟล์รูปภาพ";
        continue;
      }
      valid.push(f);
    }
    setErrors((e) => ({ ...e, ...newErrors }));
    setForm((prev) => ({ ...prev, images: valid }));
  };

  const validate = () => {
    const v = {};
    if (!form.printerModel.trim()) v.printerModel = "กรุณากรอกรุ่นปริ้นเตอร์";
    if (!form.serialNumber.trim()) v.serialNumber = "กรุณากรอก Serial Number";
    if (role === "SHOP" && !form.customerId) v.customerId = "เลือกลูกค้า";
    if (!form.issueDesc.trim()) v.issueDesc = "กรุณาระบุอาการเสีย";
    if (!form.address.trim()) v.address = "กรุณากรอกที่อยู่";
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("printerModel", form.printerModel);
      body.append("serialNumber", form.serialNumber);
      if (role === "SHOP") body.append("customerId", String(form.customerId));
      body.append("address", form.address);
      body.append("issueDesc", form.issueDesc);
      body.append("accessories", accessoriesTextComputed);
      body.append("requestDate", new Date(form.requestDate).toISOString());
      body.append("contactInfo", JSON.stringify({
        phone: form.contactPhone,
        email: form.contactEmail,
        preferred: form.preferredContact,
      }));
      for (const img of form.images) body.append("images", img);

      const res = await fetch("/api/repairs", { method: "POST", body });
      if (!res.ok) throw new Error("สร้างงานไม่สำเร็จ");
      const data = await res.json();
      router.push(`/dashboard/repair-details?id=${data.id}`);
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>กรุณาล็อกอิน</p>;
  if (!isAllowed) return (
    <DashboardLayout user={session.user}>
      <div className="max-w-3xl mx-auto"><p>คุณไม่มีสิทธิ์เข้าหน้านี้</p></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout user={session.user}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">แจ้งซ่อมใหม่</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold">ข้อมูลเครื่อง</h2>
            <div>
              <label className="block text-sm mb-1">รุ่นปริ้นเตอร์</label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={form.printerModel}
                onChange={(e) => handleChange("printerModel", e.target.value)}
                placeholder="เช่น HP LaserJet Pro M404dn"
              />
              {errors.printerModel && <p className="text-red-600 text-sm mt-1">{errors.printerModel}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">Serial Number</label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={form.serialNumber}
                onChange={(e) => handleChange("serialNumber", e.target.value)}
                placeholder="SN-XXXXXX"
              />
              {errors.serialNumber && <p className="text-red-600 text-sm mt-1">{errors.serialNumber}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">อุปกรณ์แนบมา</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(form.accessoriesPreset).map((k) => (
                  <label key={k} className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.accessoriesPreset[k]} onChange={() => handleAccessoryToggle(k)} />
                    <span>{k}</span>
                  </label>
                ))}
              </div>
              <input
                className="w-full border px-3 py-2 rounded mt-2"
                value={form.accessoriesText}
                onChange={(e) => handleChange("accessoriesText", e.target.value)}
                placeholder="รายละเอียดเพิ่มเติม"
              />
            </div>
          </section>

          <section className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold">ผู้ติดต่อ</h2>
            {role === "SHOP" && (
              <div>
                <label className="block text-sm mb-1">ลูกค้า</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={form.customerId}
                  onChange={(e) => handleChange("customerId", e.target.value)}
                >
                  <option value="">-- เลือกลูกค้า (mock) --</option>
                  <option value="1">ลูกค้า A</option>
                  <option value="2">ลูกค้า B</option>
                </select>
                {errors.customerId && <p className="text-red-600 text-sm mt-1">{errors.customerId}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm mb-1">ที่อยู่</label>
              <textarea
                className="w-full border px-3 py-2 rounded"
                rows={3}
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">อาการเสีย</label>
              <textarea
                className="w-full border px-3 py-2 rounded"
                rows={4}
                value={form.issueDesc}
                onChange={(e) => handleChange("issueDesc", e.target.value)}
              />
              {errors.issueDesc && <p className="text-red-600 text-sm mt-1">{errors.issueDesc}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">วันที่/เวลาแจ้ง</label>
                <input
                  type="datetime-local"
                  className="w-full border px-3 py-2 rounded"
                  value={form.requestDate}
                  onChange={(e) => handleChange("requestDate", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">ช่องทางติดต่อ</label>
                <div className="flex gap-4 items-center">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="pref"
                      checked={form.preferredContact === "phone"}
                      onChange={() => handleChange("preferredContact", "phone")}
                    />
                    <span>โทร</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="pref"
                      checked={form.preferredContact === "email"}
                      onChange={() => handleChange("preferredContact", "email")}
                    />
                    <span>Email</span>
                  </label>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <input
                    className="w-full border px-3 py-2 rounded"
                    placeholder="เบอร์โทร"
                    value={form.contactPhone}
                    onChange={(e) => handleChange("contactPhone", e.target.value)}
                  />
                  <input
                    className="w-full border px-3 py-2 rounded"
                    placeholder="อีเมล"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold">รูปภาพแนบ</h2>
            <input type="file" multiple accept="image/*" onChange={(e) => handleImages(e.target.files)} />
            {errors.images && <p className="text-red-600 text-sm mt-1">{errors.images}</p>}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {form.images.map((img, idx) => (
                  <div key={idx} className="border rounded p-2">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${idx}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <p className="text-xs mt-1 truncate">{img.name}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={() => router.back()}
              disabled={submitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${submitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
              disabled={submitting}
            >
              {submitting ? "กำลังบันทึก..." : "บันทึกงานซ่อม"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
