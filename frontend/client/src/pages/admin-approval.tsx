import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Eye, FileText, Download } from "lucide-react";
import { COURSES } from "@/lib/mock-data";

// Mock requests data
const REQUESTS = [
  {
    id: "r1",
    user: {
      name: "Петров Алексей",
      department: "Отдел разработки",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    courses: [COURSES[0], COURSES[3], COURSES[5]], // Angular, Python, Security
    totalCost: 195000,
    status: "pending",
    date: "2024-06-15",
    comment: "Необходимо для нового проекта по миграции легаси систем."
  },
  {
    id: "r2",
    user: {
      name: "Смирнова Елена",
      department: "HR отдел",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
    },
    courses: [COURSES[4]], // Soft Skills
    totalCost: 25000,
    status: "approved",
    date: "2024-06-14",
    comment: "Повышение квалификации для работы с командой."
  },
  {
    id: "r3",
    user: {
      name: "Сидоров Михаил",
      department: "Аналитика",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    },
    courses: [COURSES[2], COURSES[3]], // Analysis, Python
    totalCost: 95000,
    status: "rejected",
    date: "2024-06-12",
    comment: "Хочу изучить новые инструменты."
  }
];

export default function AdminApproval() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-secondary">Панель администратора</h1>
            <p className="text-muted-foreground">Управление заявками на обучение и бюджетом</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Экспорт отчета
            </Button>
            <Button>Распределить бюджет</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Новых заявок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">12</div>
              <p className="text-xs text-muted-foreground">Требуют рассмотрения</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Утверждено (Q3)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">45</div>
              <p className="text-xs text-muted-foreground">Сотрудников начнут обучение</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Бюджет (Q3)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2M ₽</div>
              <p className="text-xs text-muted-foreground">Из 2.5M ₽ запланированных</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Заявки сотрудников</CardTitle>
            <CardDescription>Список заявок на согласование внешнего обучения</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Ожидают (12)</TabsTrigger>
                <TabsTrigger value="approved">Утверждены</TabsTrigger>
                <TabsTrigger value="rejected">Отклонены</TabsTrigger>
                <TabsTrigger value="all">Все заявки</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Сотрудник</TableHead>
                      <TableHead>Курсы</TableHead>
                      <TableHead>Стоимость</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {REQUESTS.filter(r => r.status === 'pending').map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={req.user.avatar} />
                              <AvatarFallback>{req.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{req.user.name}</div>
                              <div className="text-xs text-muted-foreground">{req.user.department}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {req.courses.map(c => (
                              <div key={c.id} className="text-sm">• {c.title}</div>
                            ))}
                            {req.comment && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                <span className="italic">"{req.comment}"</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{req.totalCost.toLocaleString()} ₽</div>
                        </TableCell>
                        <TableCell>{req.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <X className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

               <TabsContent value="approved">
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  Здесь будет список утвержденных заявок
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
