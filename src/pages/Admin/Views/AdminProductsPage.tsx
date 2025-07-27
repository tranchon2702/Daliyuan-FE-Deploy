import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Star, Pencil, Trash2 } from "lucide-react";
import { useAdminProducts } from "../useAdmin";
import AddProductModal from "./AddProductModal";
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import { getProductById } from '@/services/productService';
import { Product } from '@/services/productService';
import { getProducts } from '@/services/productService';
import { useEffect } from 'react';

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

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Hàm lấy URL ảnh phù hợp
const getOptimizedImageUrl = (imagePath: string): string => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  
  if (!imagePath) {
    return '/placeholder.svg';
  }
  
  // Kiểm tra xem image đã là URL đầy đủ chưa
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Kiểm tra xem image có phải là base64 không
  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }
  
  // Ưu tiên sử dụng phiên bản thumbnailWebp nếu có
  if (imagePath.includes('/original/')) {
    // Thay thế '/original/' bằng '/thumbnail/' và thêm '-thumbnail.webp' vào tên file
    const basePath = imagePath.split('/original/')[0];
    const fileName = imagePath.split('/original/')[1].split('.')[0];
    return `${backendUrl}${basePath}/thumbnail/${fileName}-thumbnail.webp`;
  }
  
  // Nếu là đường dẫn tương đối, thêm backendUrl
  return `${backendUrl}${imagePath}`;
};

const AdminProductsPage = () => {
    const { 
        products, 
        productCount,
        categories,
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        handleSearch,
        handleFilterChange,
        addProduct,
        updateProduct,
        deleteProduct,
        name, setName,
        nameZh, setNameZh,
        code, setCode,
        categoryId, setCategoryId,
        categoryName, setCategoryName,
        price, setPrice,
        description, setDescription,
        descriptionZh, setDescriptionZh,
        stock, setStock,
        images, setImages,
        detailImages, setDetailImages,
        isFeatured, setIsFeatured,
        status, setStatus,
        resetAddProductForm,
        isBestSeller, setIsBestSeller,
        isMustTry, setIsMustTry,
        isNewArrival, setIsNewArrival,
        isTrending, setIsTrending,
        giaGoi, setGiaGoi,
        giaThung, setGiaThung,
        giaLoc, setGiaLoc,
        setProducts,
    } = useAdminProducts();
    const { toast } = useToast();
    const [deleteId, setDeleteId] = useState<string|null>(null);
    const [editId, setEditId] = useState<string|null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEditProduct, setCurrentEditProduct] = useState<ExtendedProduct | null>(null);
    
    // Hàm mở popup edit (luôn lấy từ DB)
    const openEditModal = async (id: string) => {
        setEditId(id);
        setIsEditModalOpen(true);
        try {
            const product = await getProductById(id) as ExtendedProduct;
            console.log("Fetched product data:", product); // Debug log
            
            // Lưu sản phẩm hiện tại để truyền cho modal
            setCurrentEditProduct(product);
            
            // Set basic product info
            setName(product.name || '');
            setNameZh(product.nameZh || '');
            setCode(product.code || '');
            
            // Handle category data
            if (typeof product.category === 'object' && product.category !== null) {
                setCategoryId(product.category._id || '');
                setCategoryName(product.mainCategory === 'bánh' ? 'Bánh' : product.mainCategory === 'nước' ? 'Nước' : '');
            } else if (typeof product.category === 'string') {
                setCategoryId(product.category);
                setCategoryName(product.mainCategory === 'bánh' ? 'Bánh' : product.mainCategory === 'nước' ? 'Nước' : '');
            }
            
            // Set pricing and other fields
            setPrice(product.price?.toString() || '');
            setDescription(product.description || '');
            setDescriptionZh(product.descriptionZh || '');
            setStock(product.stock || 0);
            
            // Reset images để không gửi file mới nếu không chọn
            setImages([]);
            
            // Set feature flags
            setIsFeatured(product.isFeatured || false);
            setIsBestSeller(product.isBestSeller || false);
            setIsMustTry(product.isMustTry || false);
            setIsNewArrival(product.isNewArrival || false);
            setIsTrending(product.isTrending || false);
            setStatus((product.status as 'Còn hàng' | 'Hết hàng') || 'Còn hàng');
            
            // Set pricing based on product type
            setGiaGoi(product.giaGoi?.toString() || '');
            setGiaThung(product.giaThung?.toString() || '');
            setGiaLoc(product.giaLoc?.toString() || '');
            
            // If pricing not available directly, try to extract from unitOptions
            if (product.unitOptions && product.unitOptions.length > 0) {
                const goiOption = product.unitOptions.find(opt => opt.unitType === 'Gói');
                const thungOption = product.unitOptions.find(opt => opt.unitType === 'Thùng');
                const locOption = product.unitOptions.find(opt => opt.unitType === 'Lốc');
                
                if (goiOption && (!product.giaGoi || product.giaGoi === 0)) {
                    setGiaGoi(goiOption.price.toString());
                }
                
                if (thungOption && (!product.giaThung || product.giaThung === 0)) {
                    setGiaThung(thungOption.price.toString());
                }
                
                if (locOption && (!product.giaLoc || product.giaLoc === 0)) {
                    setGiaLoc(locOption.price.toString());
                }
            }
        } catch (err: unknown) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", err);
            let errorMessage = 'Vui lòng thử lại sau';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            toast({ 
                title: 'Không thể lấy thông tin sản phẩm', 
                description: errorMessage,
                variant: 'destructive' 
            });
        }
    };
    // Xử lý cập nhật sản phẩm
    const handleUpdateProduct = async () => {
        try {
            await updateProduct(editId);
            toast({ title: 'Cập nhật sản phẩm thành công!' });
            setIsEditModalOpen(false);
            setCurrentEditProduct(null);
            
            // Force refresh product list after update
            try {
                const res = await getProducts();
                setProducts(res.products);
                console.log("Product list refreshed after update");
            } catch (refreshErr) {
                console.error("Error refreshing product list:", refreshErr);
            }
        } catch (err) {
            console.error("Error updating product:", err);
            toast({ 
                title: 'Cập nhật sản phẩm thất bại!', 
                description: err instanceof Error ? err.message : 'Vui lòng thử lại sau',
                variant: 'destructive' 
            });
        }
    };

    // Hàm xác nhận xóa
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteProduct(deleteId);
            toast({ title: 'Xóa sản phẩm thành công!' });
        } catch (err) {
            console.error("Error deleting product:", err);
            toast({ 
                title: 'Xóa sản phẩm thất bại!', 
                description: err instanceof Error ? err.message : 'Vui lòng thử lại sau',
                variant: 'destructive' 
            });
        } finally {
            setDeleteId(null);
        }
    };
    const handleOpenAddModal = () => {
        resetAddProductForm();
        setCurrentEditProduct(null);
        openAddModal();
    };

    // Đóng modal edit và reset state
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentEditProduct(null);
    };

    return (
        <>
            <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-dessert-primary">Quản lý sản phẩm</h1>
                        <p className="text-muted-foreground">Thêm, sửa và quản lý các sản phẩm của bạn</p>
                    </div>
                    <Button onClick={handleOpenAddModal} className="bg-dessert-accent hover:bg-dessert-primary text-white font-semibold shadow-glow">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Thêm sản phẩm mới
                    </Button>
                </div>

                <Card className="shadow-card rounded-2xl border-0">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-dessert-dark">Bộ lọc & tìm kiếm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-dessert-accent" />
                                <Input 
                                    placeholder="Tìm theo tên sản phẩm, mã..." 
                                    className="pl-10 py-2 rounded-xl border-dessert-secondary focus:border-dessert-accent focus:ring-2 focus:ring-dessert-accent/30"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <Select onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger className="rounded-xl border-dessert-secondary focus:border-dessert-accent">
                                    <SelectValue placeholder="Tất cả trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="available">Còn hàng</SelectItem>
                                    <SelectItem value="sold">Hết hàng</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(value) => handleFilterChange('category', value)}>
                                <SelectTrigger className="rounded-xl border-dessert-secondary focus:border-dessert-accent">
                                    <SelectValue placeholder="Tất cả danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                                    <SelectItem value="Bánh">Bánh</SelectItem>
                                    <SelectItem value="Nước">Nước</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select defaultValue="10">
                                <SelectTrigger className="rounded-xl border-dessert-secondary focus:border-dessert-accent">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10 / trang</SelectItem>
                                    <SelectItem value="20">20 / trang</SelectItem>
                                    <SelectItem value="50">50 / trang</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-card rounded-2xl border-0">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-dessert-dark">Danh sách sản phẩm ({productCount})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-xl">
                        <Table className="min-w-[900px]">
                            <TableHeader className="sticky top-0 z-10 bg-dessert-cream/80 dark:bg-dessert-dark/80">
                                <TableRow>
                                    <TableHead className="w-[300px]">Sản phẩm</TableHead>
                                    <TableHead>Danh mục</TableHead>
                                    <TableHead>Giá</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Tồn kho</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead>Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product._id} className="hover:bg-dessert-secondary/40 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={getOptimizedImageUrl(product.mainImage || '')}
                                                    alt={product.name} 
                                                    className="h-12 w-12 rounded-lg object-cover shadow-card"
                                                />
                                                <div>
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-sm text-muted-foreground">{product.code}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.mainCategory === 'bánh' ? 'Bánh' : product.mainCategory === 'nước' ? 'Nước' : ''}</Badge>
                                        </TableCell>
                                        <TableCell className="font-bold text-dessert-accent">{product.price}</TableCell>
                                        <TableCell>
                                            <Badge variant={product.status === 'Còn hàng' ? 'default' : 'secondary'}>
                                                {product.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {product.isFeatured && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                                                {product.stock}
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon" className="hover:bg-dessert-accent/10" onClick={() => openEditModal(product._id)}>
                                                    <Pencil className="h-4 w-4 text-dessert-primary" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="hover:bg-red-100/40" onClick={() => setDeleteId(product._id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                        {/* Phân trang (đẹp hơn) */}
                        <div className="flex justify-end mt-4">
                          <div className="inline-flex gap-2 items-center bg-white dark:bg-dessert-dark/80 rounded-2xl px-6 py-2 shadow-card border border-dessert-secondary dark:border-dessert-dark/40">
                            <Button size="sm" variant="ghost" className="font-semibold text-dessert-primary hover:bg-dessert-accent/10 rounded-xl px-4 transition">Trước</Button>
                            <span className="font-bold text-dessert-primary text-lg">1</span>
                            <Button size="sm" variant="ghost" className="font-semibold text-dessert-primary hover:bg-dessert-accent/10 rounded-xl px-4 transition">Sau</Button>
                          </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <AddProductModal 
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                mode="add"
                name={name}
                setName={setName}
                nameZh={nameZh}
                setNameZh={setNameZh}
                code={code}
                setCode={setCode}
                category={categoryName}
                setCategory={setCategoryName}
                price={price}
                setPrice={setPrice}
                description={description}
                setDescription={setDescription}
                descriptionZh={descriptionZh}
                setDescriptionZh={setDescriptionZh}
                stock={stock}
                setStock={setStock}
                images={images}
                setImages={setImages}
                detailImages={detailImages}
                setDetailImages={setDetailImages}
                isFeatured={isFeatured}
                setIsFeatured={setIsFeatured}
                isBestSeller={isBestSeller}
                setIsBestSeller={setIsBestSeller}
                isMustTry={isMustTry}
                setIsMustTry={setIsMustTry}
                isNewArrival={isNewArrival}
                setIsNewArrival={setIsNewArrival}
                isTrending={isTrending}
                setIsTrending={setIsTrending}
                status={status}
                setStatus={setStatus}
                handleSubmit={addProduct}
                giaGoi={giaGoi}
                setGiaGoi={setGiaGoi}
                giaThung={giaThung}
                setGiaThung={setGiaThung}
                giaLoc={giaLoc}
                setGiaLoc={setGiaLoc}
            />
            {/* Modal edit sản phẩm dùng lại AddProductModal */}
            <AddProductModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                mode="edit"
                name={name}
                setName={setName}
                nameZh={nameZh}
                setNameZh={setNameZh}
                code={code}
                setCode={setCode}
                category={categoryName}
                setCategory={setCategoryName}
                price={price}
                setPrice={setPrice}
                description={description}
                setDescription={setDescription}
                descriptionZh={descriptionZh}
                setDescriptionZh={setDescriptionZh}
                stock={stock}
                setStock={setStock}
                images={images}
                setImages={setImages}
                detailImages={detailImages}
                setDetailImages={setDetailImages}
                isFeatured={isFeatured}
                setIsFeatured={setIsFeatured}
                isBestSeller={isBestSeller}
                setIsBestSeller={setIsBestSeller}
                isMustTry={isMustTry}
                setIsMustTry={setIsMustTry}
                isNewArrival={isNewArrival}
                setIsNewArrival={setIsNewArrival}
                isTrending={isTrending}
                setIsTrending={setIsTrending}
                status={status}
                setStatus={setStatus}
                handleSubmit={handleUpdateProduct}
                giaGoi={giaGoi}
                setGiaGoi={setGiaGoi}
                giaThung={giaThung}
                setGiaThung={setGiaThung}
                giaLoc={giaLoc}
                setGiaLoc={setGiaLoc}
                currentProduct={currentEditProduct}
            />
            {/* Dialog xác nhận xóa */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                        <DialogDescription>Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Hủy</Button>
                        <Button variant="destructive" onClick={handleDelete}>Xóa</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AdminProductsPage; 