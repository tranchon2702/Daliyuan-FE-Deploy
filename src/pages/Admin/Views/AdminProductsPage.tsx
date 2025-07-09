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

const AdminProductsPage = () => {
    const { 
        products, 
        productCount,
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        handleSearch,
        handleFilterChange,
        addProduct,
        updateProduct,
        deleteProduct,
        name, setName,
        code, setCode,
        category, setCategory,
        price, setPrice,
        stock, setStock,
        image, setImage,
        isFeatured, setIsFeatured,
        status, setStatus
    } = useAdminProducts();

    return (
        <>
            <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-dessert-primary">Quản lý sản phẩm</h1>
                        <p className="text-muted-foreground">Thêm, sửa và quản lý các sản phẩm của bạn</p>
                    </div>
                    <Button onClick={openAddModal} className="bg-dessert-accent hover:bg-dessert-primary text-white font-semibold shadow-glow">
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
                                    <SelectItem value="Bánh Kem">Bánh Kem</SelectItem>
                                    <SelectItem value="Bánh Mousse">Bánh Mousse</SelectItem>
                                    <SelectItem value="Bánh Tart">Bánh Tart</SelectItem>
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
                                    <TableRow key={product.id} className="hover:bg-dessert-secondary/40 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-cover shadow-card" />
                                                <div>
                                                    <div className="font-semibold text-dessert-primary">{product.name}</div>
                                                    <div className="text-xs text-muted-foreground">{product.code}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.category}</Badge>
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
                                        <TableCell>{product.createdDate}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon" className="hover:bg-dessert-accent/10" onClick={() => updateProduct(product.id)}>
                                                    <Pencil className="h-4 w-4 text-dessert-primary" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="hover:bg-red-100/40" onClick={() => deleteProduct(product.id)}>
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
                name={name}
                setName={setName}
                code={code}
                setCode={setCode}
                category={category}
                setCategory={setCategory}
                price={price}
                setPrice={setPrice}
                stock={stock}
                setStock={setStock}
                image={image}
                setImage={setImage}
                isFeatured={isFeatured}
                setIsFeatured={setIsFeatured}
                status={status}
                setStatus={setStatus}
                handleSubmit={addProduct}
            />
        </>
    )
}

export default AdminProductsPage; 