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
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react";
import { useAdminNews } from "../useAdmin";

const AdminNewsPage = () => {
    const {
        articles,
        articleCount,
        handleSearch,
        handleFilterChange,
        addArticle,
        updateArticle,
        deleteArticle
    } = useAdminNews();

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-display font-bold text-dessert-primary">Quản lý tin tức</h1>
                    <p className="text-muted-foreground">Tạo và quản lý các bài viết</p>
                </div>
                <Button onClick={addArticle} className="bg-dessert-accent hover:bg-dessert-primary text-white font-semibold shadow-glow">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Viết bài mới
                </Button>
            </div>

            <Card className="shadow-card rounded-2xl border-0">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-dessert-dark">Bộ lọc & tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-dessert-accent" />
                            <Input 
                                placeholder="Tìm theo tiêu đề bài viết..." 
                                className="pl-10 py-2 rounded-xl border-dessert-secondary focus:border-dessert-accent focus:ring-2 focus:ring-dessert-accent/30"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <Select onValueChange={handleFilterChange}>
                            <SelectTrigger className="rounded-xl border-dessert-secondary focus:border-dessert-accent">
                                <SelectValue placeholder="Tất cả trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="published">Đã xuất bản</SelectItem>
                                <SelectItem value="draft">Bản nháp</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-card rounded-2xl border-0">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-dessert-dark">Danh sách bài viết ({articleCount})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-xl">
                    <Table className="min-w-[700px]">
                        <TableHeader className="sticky top-0 z-10 bg-dessert-cream/80 dark:bg-dessert-dark/80">
                            <TableRow>
                                <TableHead className="w-[60%]">Tiêu đề</TableHead>
                                <TableHead>Tác giả</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles.map((article) => (
                                <TableRow key={article.id} className="hover:bg-dessert-secondary/40 transition-colors">
                                    <TableCell className="font-semibold text-dessert-primary">{article.title}</TableCell>
                                    <TableCell>{article.author}</TableCell>
                                    <TableCell>
                                        <Badge variant={article.status === 'Đã xuất bản' ? 'default' : 'secondary'}>
                                            {article.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{article.createdDate}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon" className="hover:bg-dessert-accent/10" onClick={() => updateArticle(article.id)}>
                                                <Pencil className="h-4 w-4 text-dessert-primary" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="hover:bg-red-100/40" onClick={() => deleteArticle(article.id)}>
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
    )
}

export default AdminNewsPage; 