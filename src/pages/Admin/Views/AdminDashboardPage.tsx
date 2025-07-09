import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, Newspaper, BarChart2 } from "lucide-react";
import { useAdminDashboard } from "../useAdmin";

const AdminDashboardPage = () => {
    const { stats } = useAdminDashboard();

    const cardClass =
      "bg-gradient-to-br from-dessert-cream/80 to-dessert-secondary/80 shadow-card rounded-2xl border-0 hover:shadow-hover transition-all duration-300 group cursor-pointer";
    const iconClass =
      "h-10 w-10 text-dessert-accent group-hover:scale-110 group-hover:text-dessert-primary transition-transform duration-300";
    const valueClass = "text-3xl font-extrabold text-dessert-primary";
    const changeClass = "text-xs text-muted-foreground mt-1";

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center gap-4 mb-2">
                <BarChart2 className="h-7 w-7 text-dessert-accent" />
                <h1 className="text-3xl font-display font-bold text-dessert-primary">Tổng quan cửa hàng</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className={cardClass}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold text-dessert-dark">Tổng doanh thu</CardTitle>
                        <DollarSign className={iconClass} />
                    </CardHeader>
                    <CardContent>
                        <div className={valueClass}>{stats.totalRevenue.amount}</div>
                        <div className={changeClass}>{stats.totalRevenue.change} so với tháng trước</div>
                    </CardContent>
                </Card>
                <Card className={cardClass}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold text-dessert-dark">Đơn hàng</CardTitle>
                        <ShoppingBag className={iconClass} />
                    </CardHeader>
                    <CardContent>
                        <div className={valueClass}>{stats.orders.amount}</div>
                        <div className={changeClass}>{stats.orders.change} so với tháng trước</div>
                    </CardContent>
                </Card>
                <Card className={cardClass}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold text-dessert-dark">Khách hàng mới</CardTitle>
                        <Users className={iconClass} />
                    </CardHeader>
                    <CardContent>
                        <div className={valueClass}>{stats.newCustomers.amount}</div>
                        <div className={changeClass}>{stats.newCustomers.change} so với tháng trước</div>
                    </CardContent>
                </Card>
                <Card className={cardClass}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold text-dessert-dark">Bài viết</CardTitle>
                        <Newspaper className={iconClass} />
                    </CardHeader>
                    <CardContent>
                        <div className={valueClass}>{stats.articles.amount}</div>
                        <div className={changeClass}>{stats.articles.change} so với tháng trước</div>
                    </CardContent>
                </Card>
            </div>
            {/* Placeholder cho biểu đồ nhỏ */}
            <div className="mt-8 bg-white/80 dark:bg-dessert-dark/60 rounded-2xl shadow-card p-6 flex flex-col items-center justify-center min-h-[220px]">
                <div className="text-lg font-semibold text-dessert-primary mb-2">Biểu đồ doanh thu (Demo)</div>
                <div className="w-full h-32 flex items-center justify-center text-muted-foreground opacity-60">
                  (Biểu đồ sẽ hiển thị ở đây)
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardPage; 