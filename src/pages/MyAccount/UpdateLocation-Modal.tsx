import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface UpdateLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: any;
  setForm: (f: any) => void;
  loadingProvinces: boolean;
  loadingDistricts: boolean;
  loadingWards: boolean;
  provinces: any[];
  districts: any[];
  wards: any[];
  handleSubmit: (e: React.FormEvent) => void;
  editId: string | null;
  onCancel: () => void;
}

const UpdateLocationModal: React.FC<UpdateLocationModalProps> = ({
  open,
  onOpenChange,
  form,
  setForm,
  loadingProvinces,
  loadingDistricts,
  loadingWards,
  provinces,
  districts,
  wards,
  handleSubmit,
  editId,
  onCancel,
}) => {
  const { t } = useTranslation();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-8 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {editId ? t('my_account_page.address_modal.edit_title') : t('my_account_page.address_modal.add_title')}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground pb-2">
            {editId
              ? t('my_account_page.address_modal.edit_desc')
              : t('my_account_page.address_modal.add_desc')}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">{t('my_account_page.address_modal.full_name_label')}</Label>
              <Input id="fullName" placeholder={t('my_account_page.address_modal.full_name_placeholder')} value={form.fullName} onChange={e => setForm((f: any) => ({ ...f, fullName: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="phone">{t('my_account_page.address_modal.phone_label')}</Label>
              <Input id="phone" placeholder={t('my_account_page.address_modal.phone_placeholder')} value={form.phone} onChange={e => setForm((f: any) => ({ ...f, phone: e.target.value }))} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">{t('my_account_page.address_modal.address_label')}</Label>
              <Input id="address" placeholder={t('my_account_page.address_modal.address_placeholder')} value={form.address} onChange={e => setForm((f: any) => ({ ...f, address: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="city">{t('my_account_page.address_modal.city_label')}</Label>
              <Select
                value={form.city ? String(form.city) : ""}
                onValueChange={val => setForm((f: any) => ({ ...f, city: String(val), district: "", ward: "" }))}
                disabled={loadingProvinces}
                required
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder={t('my_account_page.address_modal.city_placeholder')} />
                  {loadingProvinces && <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />}
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p: any) => (
                    <SelectItem key={p.code} value={String(p.code)}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="district">{t('my_account_page.address_modal.district_label')}</Label>
              <Select
                value={form.district ? String(form.district) : ""}
                onValueChange={val => setForm((f: any) => ({ ...f, district: String(val), ward: "" }))}
                disabled={!form.city || loadingDistricts}
                required
              >
                <SelectTrigger id="district">
                  <SelectValue placeholder={t('my_account_page.address_modal.district_placeholder')} />
                  {loadingDistricts && <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />}
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d: any) => (
                    <SelectItem key={d.code} value={String(d.code)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ward">{t('my_account_page.address_modal.ward_label')}</Label>
              <Select
                value={form.ward ? String(form.ward) : ""}
                onValueChange={val => setForm((f: any) => ({ ...f, ward: String(val) }))}
                disabled={!form.district || loadingWards}
                required
              >
                <SelectTrigger id="ward">
                  <SelectValue placeholder={t('my_account_page.address_modal.ward_placeholder')} />
                  {loadingWards && <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />}
                </SelectTrigger>
                <SelectContent>
                  {wards.map((w: any) => (
                    <SelectItem key={w.code} value={String(w.code)}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-6">
            <Button type="submit" size="lg" className="font-semibold">
              {editId ? t('my_account_page.address_modal.update_button') : t('my_account_page.address_modal.add_button')}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={onCancel} className="font-semibold">
              {t('my_account_page.address_modal.cancel_button')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLocationModal; 