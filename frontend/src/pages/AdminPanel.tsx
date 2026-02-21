import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
    BarChart3,
    Users,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    Loader2,
    AlertCircle,
    Search,
    Filter,
    Eye,
    MoreVertical,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    order_id: string;
    payment_id: string;
    amount: number;
    items: OrderItem[];
    status: "pending" | "completed" | "failed" | "cancelled";
    user_id: string;
    shipping_address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
    };
    user_profiles?: {
        email: string;
        name: string;
    };
    created_at: string;
    updated_at?: string;
}

interface Stats {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    pendingOrders: number;
    failedOrders: number;
}

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const AdminPanel = () => {
    const { user, session } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    useEffect(() => {
        // if (!user) {
        //     navigate("/auth");
        //     return;
        // }
        // TODO: Add role verification - check if user is admin
        // if (!(user.role === "Admin")) {
        //     navigate("/auth")
        //     return;
        // }
        fetchStats();
        fetchOrders();
    }, [user, navigate, statusFilter, currentPage]);

    const fetchStats = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/admin/orders/stats/overview`,
                {
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch statistics");
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            let url = `${import.meta.env.VITE_BACKEND_URL}/admin/orders?page=${currentPage}&limit=20`;

            if (statusFilter !== "all") {
                url += `&status=${statusFilter}`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error("Admin access required");
                }
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();
            setOrders(data.orders || []);
            setPagination(data.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            setUpdatingOrderId(orderId);

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/admin/orders/${orderId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.access_token}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update order");
            }

            const result = await response.json();
            setOrders(
                orders.map((order) =>
                    order.id === orderId ? result.order : order
                )
            );
            toast.success("Order status updated successfully");
            fetchStats();
        } catch (err) {
            toast.error("Failed to update order status");
            console.error("Error:", err);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "pending":
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case "failed":
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            case "cancelled":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredOrders = orders.filter((order) =>
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user_profiles?.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 mt-20">
            <Header />

            <main className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Admin Dashboard
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Manage and track all customer orders
                    </p>
                </motion.div>

                {/* Error State */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8"
                    >
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <p className="text-red-800 dark:text-red-300">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Statistics Cards */}
                {stats && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
                    >
                        {/* Total Orders */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Total Orders
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.totalOrders}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Revenue */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Total Revenue
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            ₹{(stats.totalRevenue / 100).toFixed(0)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Completed Orders */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Completed
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.completedOrders}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pending Orders */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                        <Clock className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Pending
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.pendingOrders}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Failed Orders */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                        <XCircle className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Failed
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.failedOrders}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders</CardTitle>
                            <CardDescription>
                                Manage all customer orders and their statuses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Filters */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search by order ID or email..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="md:w-40">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Loading State */}
                            {loading ? (
                                <div className="flex justify-center items-center gap-3 py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                    <span className="text-lg text-gray-600 dark:text-gray-400">
                                        Loading orders...
                                    </span>
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No orders found
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Table */}
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead>Order ID</TableHead>
                                                    <TableHead>Customer Email</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredOrders.map((order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell className="font-medium font-mono text-sm">
                                                            {order.order_id}
                                                        </TableCell>
                                                        <TableCell>
                                                            {order.user_profiles?.email || "Unknown"}
                                                        </TableCell>
                                                        <TableCell className="font-semibold">
                                                            ₹{(order.amount / 100).toFixed(2)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={getStatusColor(order.status)}>
                                                                <div className="flex items-center gap-1">
                                                                    {getStatusIcon(order.status)}
                                                                    {order.status.charAt(0).toUpperCase() +
                                                                        order.status.slice(1)}
                                                                </div>
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                                            {formatDate(order.created_at)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        className="h-8 w-8 p-0"
                                                                        disabled={updatingOrderId === order.id}
                                                                    >
                                                                        {updatingOrderId === order.id ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        ) : (
                                                                            <MoreVertical className="w-4 h-4" />
                                                                        )}
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        onClick={() => setSelectedOrder(order)}
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-2" />
                                                                        View Details
                                                                    </DropdownMenuItem>
                                                                    {order.status !== "completed" && (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleUpdateOrderStatus(
                                                                                    order.id,
                                                                                    "completed"
                                                                                )
                                                                            }
                                                                        >
                                                                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                                                            Mark as Completed
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    {order.status !== "pending" && (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleUpdateOrderStatus(
                                                                                    order.id,
                                                                                    "pending"
                                                                                )
                                                                            }
                                                                        >
                                                                            <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                                                                            Mark as Pending
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    {order.status !== "failed" && (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleUpdateOrderStatus(
                                                                                    order.id,
                                                                                    "failed"
                                                                                )
                                                                            }
                                                                        >
                                                                            <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                                                            Mark as Failed
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    {order.status !== "cancelled" && (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleUpdateOrderStatus(
                                                                                    order.id,
                                                                                    "cancelled"
                                                                                )
                                                                            }
                                                                        >
                                                                            <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                                                                            Mark as Cancelled
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Pagination */}
                                    {pagination && pagination.totalPages > 1 && (
                                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Page {pagination.page} of {pagination.totalPages}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    disabled={currentPage === 1}
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    disabled={
                                                        currentPage === pagination.totalPages
                                                    }
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Order Details Modal */}
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Order Details
                                </h2>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    ✕
                                </Button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Header Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Order ID
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">
                                            {selectedOrder.order_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Status
                                        </p>
                                        <Badge className={getStatusColor(selectedOrder.status)}>
                                            {selectedOrder.status.charAt(0).toUpperCase() +
                                                selectedOrder.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Customer Information
                                    </h3>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Email:
                                            </span>{" "}
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {selectedOrder.user_profiles?.email}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Name:
                                            </span>{" "}
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {selectedOrder.user_profiles?.name || "Not provided"}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Items
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="flex justify-between items-center text-xl font-bold text-gray-900 dark:text-white">
                                        <span>Total Amount:</span>
                                        <span>₹{(selectedOrder.amount / 100).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                {selectedOrder.shipping_address && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                            Shipping Address
                                        </h3>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm space-y-1">
                                            {selectedOrder.shipping_address.street && (
                                                <p className="text-gray-900 dark:text-white">{selectedOrder.shipping_address.street}</p>
                                            )}
                                            <p className="text-gray-900 dark:text-white">
                                                {[selectedOrder.shipping_address.city, selectedOrder.shipping_address.state, selectedOrder.shipping_address.zip].filter(Boolean).join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Payment Details
                                    </h3>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm">
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Payment ID:
                                            </span>{" "}
                                            <span className="font-mono text-gray-900 dark:text-white">
                                                {selectedOrder.payment_id}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Created:
                                            </span>{" "}
                                            <span className="text-gray-900 dark:text-white">
                                                {formatDate(selectedOrder.created_at)}
                                            </span>
                                        </p>
                                        {selectedOrder.updated_at && (
                                            <p>
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Updated:
                                                </span>{" "}
                                                <span className="text-gray-900 dark:text-white">
                                                    {formatDate(selectedOrder.updated_at)}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Change Status */}
                                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Update Status
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(["pending", "completed", "failed", "cancelled"] as const).map((status) => (
                                            <Button
                                                key={status}
                                                variant={selectedOrder.status === status ? "default" : "outline"}
                                                size="sm"
                                                disabled={selectedOrder.status === status || updatingOrderId === selectedOrder.id}
                                                onClick={() => {
                                                    handleUpdateOrderStatus(selectedOrder.id, status);
                                                    setSelectedOrder({ ...selectedOrder, status });
                                                }}
                                                className="gap-1.5 capitalize"
                                            >
                                                {getStatusIcon(status)}
                                                {status}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AdminPanel;
