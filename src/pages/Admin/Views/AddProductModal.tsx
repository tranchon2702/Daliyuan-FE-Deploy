import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRef, useState } from "react";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    setName: (v: string) => void;
    code: string;
    setCode: (v: string) => void;
    category: string;
    setCategory: (v: string) => void;
    price: string;
    setPrice: (v: string) => void;
    stock: number;
    setStock: (v: number) => void;
    image: string;
    setImage: (v: string) => void;
    isFeatured: boolean;
    setIsFeatured: (v: boolean) => void;
    status: 'Còn hàng' | 'Hết hàng';
    setStatus: (v: 'Còn hàng' | 'Hết hàng') => void;
    handleSubmit: () => void;
}

const AddProductModal = ({
    isOpen,
    onClose,
    name, setName,
    code, setCode,
    category, setCategory,
    price, setPrice,
    stock, setStock,
    image, setImage,
    isFeatured, setIsFeatured,
    status, setStatus,
    handleSubmit,
}: AddProductModalProps) => {
    // State cho file upload và xem trước ảnh
    const [preview, setPreview] = useState<string>(image || "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    // Xử lý khi chọn file ảnh
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            setImage(url);
        }
    };

    // Xử lý drag & drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            setImage(url);
        }
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    // Nếu modal đóng thì reset preview nếu cần
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin chi tiết cho sản phẩm mới. Nhấn lưu để hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Tên sản phẩm</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">Mã sản phẩm</Label>
                        <Input id="code" value={code} onChange={e => setCode(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Loại sản phẩm</Label>
                        <Select onValueChange={setCategory} value={category} defaultValue={category}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn loại sản phẩm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Bánh Kem">Bánh Kem</SelectItem>
                                <SelectItem value="Bánh Mousse">Bánh Mousse</SelectItem>
                                <SelectItem value="Bánh Tart">Bánh Tart</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Giá (VNĐ)</Label>
                        <Input id="price" value={price} onChange={e => setPrice(e.target.value)} className="col-span-3" placeholder="ví dụ: 550.000đ" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock" className="text-right">Tồn kho</Label>
                        <Input id="stock" type="number" value={stock} onChange={e => setStock(parseInt(e.target.value, 10) || 0)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Trạng thái</Label>
                        <Select onValueChange={(v) => setStatus(v as 'Còn hàng' | 'Hết hàng')} value={status} defaultValue={status}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Còn hàng">Còn hàng</SelectItem>
                                <SelectItem value="Hết hàng">Hết hàng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">Hình ảnh</Label>
                        <div className="col-span-3 flex flex-col gap-2">
                            <div
                                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition p-4 cursor-pointer ${dragActive ? 'border-dessert-accent bg-dessert-accent/10' : 'border-dessert-secondary bg-dessert-cream/40 hover:border-dessert-accent'}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                style={{ minHeight: 96 }}
                            >
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    tabIndex={-1}
                                />
                                {!preview && (
                                    <span className="text-sm text-muted-foreground select-none">Kéo & thả ảnh vào đây hoặc bấm để chọn file</span>
                                )}
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Xem trước ảnh"
                                        className="h-24 rounded-lg object-cover border border-dessert-secondary shadow"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="featured" className="text-right">Sản phẩm nổi bật</Label>
                        <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button onClick={handleSubmit}>Lưu sản phẩm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddProductModal; 