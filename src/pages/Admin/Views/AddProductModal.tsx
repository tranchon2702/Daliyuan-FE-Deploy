import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState, useEffect } from "react";
import { Product } from "@/services/productService";
import { X } from "lucide-react";

// Mở rộng interface Product để bao gồm các thuộc tính mới
interface ExtendedProduct extends Product {
    isBestSeller?: boolean;
    isMustTry?: boolean;
    isNewArrival?: boolean;
    isTrending?: boolean;
    giaGoi?: number;
    giaThung?: number;
    giaLoc?: number;
}

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
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
    images: File[];
    setImages: (files: File[]) => void;
    detailImages?: File[];
    setDetailImages?: (files: File[]) => void;
    isFeatured: boolean;
    setIsFeatured: (v: boolean) => void;
    status: 'Còn hàng' | 'Hết hàng';
    setStatus: (v: 'Còn hàng' | 'Hết hàng') => void;
    handleSubmit: () => void;
    // Các props khác cho extended fields
    nameZh?: string;
    setNameZh?: (v: string) => void;
    description?: string;
    setDescription?: (v: string) => void;
    descriptionZh?: string;
    setDescriptionZh?: (v: string) => void;
    isBestSeller?: boolean;
    setIsBestSeller?: (v: boolean) => void;
    isMustTry?: boolean;
    setIsMustTry?: (v: boolean) => void;
    isNewArrival?: boolean;
    setIsNewArrival?: (v: boolean) => void;
    isTrending?: boolean;
    setIsTrending?: (v: boolean) => void;
    giaGoi?: string;
    setGiaGoi?: (v: string) => void;
    giaThung?: string;
    setGiaThung?: (v: string) => void;
    giaLoc?: string;
    setGiaLoc?: (v: string) => void;
    currentProduct?: ExtendedProduct | null;
}

const AddProductModal = ({
    isOpen,
    onClose,
    mode,
    name, setName,
    code, setCode,
    category, setCategory,
    price, setPrice,
    stock, setStock,
    images, setImages,
    detailImages: propDetailImages,
    setDetailImages: propSetDetailImages,
    isFeatured, setIsFeatured,
    status, setStatus,
    handleSubmit,
    // Extended props
    nameZh, setNameZh,
    description, setDescription,
    descriptionZh, setDescriptionZh,
    isBestSeller, setIsBestSeller,
    isMustTry, setIsMustTry,
    isNewArrival, setIsNewArrival,
    isTrending, setIsTrending,
    giaGoi, setGiaGoi,
    giaThung, setGiaThung,
    giaLoc, setGiaLoc,
    currentProduct,
}: AddProductModalProps) => {
    // State cho file upload và xem trước ảnh
    const [preview, setPreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [mainCategory, setMainCategory] = useState<'bánh' | 'nước' | ''>('');

    // Thêm state để lưu trữ ảnh chi tiết
    const [detailImages, setDetailImages] = useState<File[]>([]);
    const [detailImagePreviews, setDetailImagePreviews] = useState<string[]>([]);

    // Hàm xóa ảnh chi tiết
    const handleRemoveDetailImage = (index: number) => {
        const updatedPreviews = [...detailImagePreviews];
        URL.revokeObjectURL(updatedPreviews[index]);
        updatedPreviews.splice(index, 1);
        setDetailImagePreviews(updatedPreviews);

        const updatedDetailImages = [...detailImages];
        updatedDetailImages.splice(index, 1);
        setDetailImages(updatedDetailImages);
    };

    // Hàm xử lý khi chọn nhiều ảnh chi tiết
    const handleDetailImagesChange = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        // Tạo mảng từ FileList
        const fileArray = Array.from(files);
        
        // Tạo preview cho mỗi file
        const newPreviews = fileArray.map(file => URL.createObjectURL(file));
        
        // Cập nhật state
        setDetailImagePreviews(prev => [...prev, ...newPreviews]);
        
        // Cập nhật state detailImages với File objects
        const updatedDetailImages = [...detailImages, ...fileArray];
        setDetailImages(updatedDetailImages);
        
        // Log chi tiết để debug
        console.log("Added detail images:", fileArray.map(f => `${f.name} (${f.size} bytes)`));
        console.log("Total detail images:", updatedDetailImages.length);
        console.log("Detail images are File objects:", updatedDetailImages.every(img => img instanceof File));
        
        // Thông báo lên props nếu có
        if (propSetDetailImages) {
            console.log("Updating parent detailImages state with", updatedDetailImages.length, "files");
            propSetDetailImages(updatedDetailImages);
        }
    };

    // Xác định mainCategory từ category
    useEffect(() => {
        if (category === 'Bánh') {
            setMainCategory('bánh');
        } else if (category === 'Nước') {
            setMainCategory('nước');
        } else {
            setMainCategory('');
        }
    }, [category]);

    useEffect(() => {
        if (mode === 'add') {
            setPreview("");
        } else if (mode === 'edit' && currentProduct) {
            // Trong chế độ edit, hiển thị ảnh hiện tại của sản phẩm
            if (currentProduct.mainImage) {
                // Kiểm tra xem đường dẫn ảnh có phải là base64 không
                if (currentProduct.mainImage.startsWith('data:')) {
                    setPreview(currentProduct.mainImage);
                } else {
                    // Ưu tiên sử dụng phiên bản mediumWebp nếu có
                    if (currentProduct.mainImage.includes('/original/')) {
                        // Thay thế '/original/' bằng '/medium/' và thêm '-medium.webp' vào tên file
                        const basePath = currentProduct.mainImage.split('/original/')[0];
                        const fileName = currentProduct.mainImage.split('/original/')[1].split('.')[0];
                        setPreview(`${backendUrl}${basePath}/medium/${fileName}-medium.webp`);
                    } else {
                        // Nếu không phải định dạng chuẩn, sử dụng đường dẫn gốc
                        setPreview(`${backendUrl}${currentProduct.mainImage}`);
                    }
                }
            } else {
                setPreview("");
            }
        }
    }, [mode, isOpen, currentProduct, backendUrl]);

    // Đồng bộ state detailImages với props và hiển thị preview khi edit
    useEffect(() => {
        if (propDetailImages) {
            setDetailImages(propDetailImages);
        }
        
        // Hiển thị preview ảnh chi tiết khi ở chế độ edit
        if (mode === 'edit' && currentProduct && currentProduct.images && currentProduct.images.length > 0) {
            console.log("Setting up detail image previews for edit mode", currentProduct.images);
            
            // Tạo preview từ ảnh hiện có (bỏ qua ảnh đầu tiên vì đó là ảnh chính)
            const imageUrls = currentProduct.images.map(img => {
                if (img.startsWith('data:')) {
                    return img;
                } else {
                    // Ưu tiên sử dụng phiên bản mediumWebp nếu có
                    // Kiểm tra xem ảnh có phải là đường dẫn gốc không
                    if (img.includes('/original/')) {
                        // Thay thế '/original/' bằng '/medium/' và thêm '-medium.webp' vào tên file
                        const basePath = img.split('/original/')[0];
                        const fileName = img.split('/original/')[1].split('.')[0];
                        return `${backendUrl}${basePath}/medium/${fileName}-medium.webp`;
                    } else {
                        // Nếu không phải định dạng chuẩn, sử dụng đường dẫn gốc
                        return `${backendUrl}${img}`;
                    }
                }
            });
            
            console.log("Detail image preview URLs:", imageUrls);
            setDetailImagePreviews(imageUrls);
            
            // Không thể set string[] vào File[], chỉ hiển thị preview
        }
    }, [propDetailImages, mode, currentProduct, backendUrl]);

    // Đồng bộ thay đổi từ state detailImages lên props
    useEffect(() => {
        if (propSetDetailImages && detailImages) {
            propSetDetailImages(detailImages);
        }
    }, [detailImages, propSetDetailImages]);

    // Xử lý khi chọn file ảnh
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            // Kiểm tra xem file có phải là file ảnh thực sự không
            const file = files[0];
            if (file.type.startsWith('image/')) {
                // Tạo URL tạm thời để hiển thị preview
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
                setImages(files);
                
                console.log("Selected file:", file.name, file.type, file.size);
            } else {
                alert('Vui lòng chọn file ảnh hợp lệ (jpg, png, gif, etc.)');
            }
        }
        
        // Reset the input value to allow selecting the same file again
        e.target.value = '';
    };

    // Xử lý drag & drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            // Tạo URL tạm thời để hiển thị preview
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setImages([file]);
            
            console.log("Dropped file:", file.name, file.type, file.size);
        } else {
            alert('Vui lòng chọn file ảnh hợp lệ (jpg, png, gif, etc.)');
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'add' 
                            ? 'Nhập thông tin chi tiết cho sản phẩm mới. Nhấn lưu để hoàn tất.'
                            : 'Chỉnh sửa thông tin sản phẩm. Nhấn lưu để cập nhật.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Tên sản phẩm (VN)</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nameZh" className="text-right">Tên sản phẩm (TQ)</Label>
                        <Input id="nameZh" value={nameZh} onChange={e => setNameZh?.(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">Mã sản phẩm</Label>
                        <Input 
                            id="code" 
                            value={code} 
                            onChange={e => {
                                // Giới hạn chỉ 6 ký tự và chỉ cho phép chữ và số
                                const value = e.target.value.toUpperCase();
                                if (value.length <= 6 && /^[A-Z0-9]*$/.test(value)) {
                                    setCode(value);
                                }
                            }} 
                            maxLength={6}
                            placeholder="Tối đa 6 ký tự"
                            className="col-span-3" 
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Loại sản phẩm</Label>
                        <Select onValueChange={setCategory} value={category} defaultValue={category}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn loại sản phẩm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Bánh">Bánh</SelectItem>
                                <SelectItem value="Nước">Nước</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {/* Mô tả */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2">Mô tả (VN)</Label>
                        <Textarea 
                            id="description" 
                            value={description} 
                            onChange={e => setDescription?.(e.target.value)} 
                            className="col-span-3 min-h-[80px]" 
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="descriptionZh" className="text-right pt-2">Mô tả (TQ)</Label>
                        <Textarea 
                            id="descriptionZh" 
                            value={descriptionZh} 
                            onChange={e => setDescriptionZh?.(e.target.value)} 
                            className="col-span-3 min-h-[80px]" 
                        />
                    </div>
                    
                    {/* Giá và tồn kho */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Giá cơ bản (VNĐ)</Label>
                        <Input id="price" value={price} onChange={e => setPrice(e.target.value)} className="col-span-3" placeholder="ví dụ: 550000" />
                    </div>
                    
                    {/* Giá theo đơn vị cho Bánh */}
                    {mainCategory === 'bánh' && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="giaGoi" className="text-right">Giá Gói (VNĐ)</Label>
                                <Input id="giaGoi" value={giaGoi} onChange={e => setGiaGoi?.(e.target.value)} className="col-span-3" placeholder="Giá cho 1 gói" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="giaThung" className="text-right">Giá Thùng (VNĐ)</Label>
                                <Input id="giaThung" value={giaThung} onChange={e => setGiaThung?.(e.target.value)} className="col-span-3" placeholder="Giá cho 1 thùng" />
                            </div>
                        </>
                    )}
                    
                    {/* Giá theo đơn vị cho Nước */}
                    {mainCategory === 'nước' && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="giaLoc" className="text-right">Giá Lốc (VNĐ)</Label>
                                <Input id="giaLoc" value={giaLoc} onChange={e => setGiaLoc?.(e.target.value)} className="col-span-3" placeholder="Giá cho 1 lốc" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="giaThung" className="text-right">Giá Thùng (VNĐ)</Label>
                                <Input id="giaThung" value={giaThung} onChange={e => setGiaThung?.(e.target.value)} className="col-span-3" placeholder="Giá cho 1 thùng" />
                            </div>
                        </>
                    )}
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock" className="text-right">Tồn kho</Label>
                        <Input id="stock" type="number" value={stock} onChange={e => setStock(parseInt(e.target.value, 10) || 0)} className="col-span-3" />
                    </div>
                    
                    {/* Trạng thái */}
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
                    
                    {/* Hình ảnh chính */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">Hình ảnh chính</Label>
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
                                    onClick={(e) => e.stopPropagation()} // Prevent double click issue
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
                            {mode === 'edit' && !images.length && (
                                <p className="text-xs text-muted-foreground">
                                    {preview ? "Đang hiển thị ảnh hiện tại. Chọn ảnh mới nếu muốn thay đổi." : "Chưa có ảnh. Vui lòng chọn ảnh."}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {/* Thêm phần upload nhiều ảnh chi tiết */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="detailImages" className="text-right">Ảnh chi tiết</Label>
                        <div className="col-span-3 flex flex-col gap-2">
                            <div
                                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition p-4 cursor-pointer ${dragActive ? 'border-dessert-accent bg-dessert-accent/10' : 'border-dessert-secondary bg-dessert-cream/40 hover:border-dessert-accent'}`}
                                onClick={() => document.getElementById('detailImages')?.click()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragActive(false);
                                    const files = e.dataTransfer.files;
                                    if (files && files.length > 0) {
                                        handleDetailImagesChange(files);
                                    }
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragActive(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragActive(false);
                                }}
                                style={{ minHeight: 96 }}
                            >
                                <input
                                    id="detailImages"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleDetailImagesChange(e.target.files);
                                        e.target.value = '';
                                    }}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    tabIndex={-1}
                                    onClick={(e) => e.stopPropagation()} // Prevent double click issue
                                />
                                <span className="text-sm text-muted-foreground select-none">Kéo & thả nhiều ảnh vào đây hoặc bấm để chọn file</span>
                            </div>
                            
                            {/* Preview ảnh chi tiết */}
                            {detailImagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    {detailImagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Chi tiết ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border border-dessert-secondary"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveDetailImage(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Các toggle tính năng */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="featured" className="text-right">Sản phẩm nổi bật</Label>
                        <div className="col-span-3">
                            <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bestSeller" className="text-right">Bán chạy nhất</Label>
                        <div className="col-span-3">
                            <Switch id="bestSeller" checked={isBestSeller} onCheckedChange={setIsBestSeller} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mustTry" className="text-right">Phải thử</Label>
                        <div className="col-span-3">
                            <Switch id="mustTry" checked={isMustTry} onCheckedChange={setIsMustTry} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newArrival" className="text-right">Sản phẩm mới</Label>
                        <div className="col-span-3">
                            <Switch id="newArrival" checked={isNewArrival} onCheckedChange={setIsNewArrival} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="trending" className="text-right">Đang hot</Label>
                        <div className="col-span-3">
                            <Switch id="trending" checked={isTrending} onCheckedChange={setIsTrending} />
                        </div>
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