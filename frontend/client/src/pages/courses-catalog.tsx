import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { AssignedCourseDto, fetchAssignedCourses, fetchMyAssignmentRequests } from "@/lib/coursesApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoursesCatalog() {
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assigned-courses", user?.id],
    queryFn: () => fetchAssignedCourses(),
    enabled: !!user?.id,
  });
  const { data: myRequests = [] } = useQuery({
    queryKey: ["assignment-requests-my", user?.id],
    queryFn: () => fetchMyAssignmentRequests(),
    enabled: !!user?.id,
  });

  const courses = (data ?? []) as AssignedCourseDto[];
  const pendingRequests = myRequests.filter((req) => req.status === "PENDING");

  const toDate = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const isArchived = (course: AssignedCourseDto) => {
    if (course.status === "COMPLETED") return true;
    if (course.status === "OVERDUE") return true;
    const now = new Date();
    const nowDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDate = toDate(course.courseEndDate);
    const dueDate = toDate(course.dueDate);
    return Boolean(
      (endDate && endDate < nowDayStart) ||
      (dueDate && dueDate < nowDayStart),
    );
  };

  const activeCourses = courses.filter((c) => !isArchived(c));
  const archivedCourses = courses.filter((c) => isArchived(c));
  const defaultTab = activeCourses.length > 0 ? "active" : pendingRequests.length > 0 ? "pending" : "archive";

  const durationLabel = (minutes?: number | null) => {
    if (!minutes) return "—";
    const hours = Math.round((minutes / 60) * 10) / 10;
    return `${hours} ч`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary">Назначенные курсы</h1>
          <p className="text-muted-foreground">Ваши текущие курсы и прогресс по ним</p>
        </div>

        {isLoading && (
          <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            Загрузка курсов...
          </div>
        )}
        {isError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            Не удалось загрузить курсы. {(error as Error).message}
          </div>
        )}
        {!isLoading && !isError && courses.length === 0 && pendingRequests.length === 0 && (
          <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            Пока нет назначенных курсов.
          </div>
        )}

        {!isLoading && !isError && (courses.length > 0 || pendingRequests.length > 0) && (
          <Tabs defaultValue={defaultTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">Активные ({activeCourses.length})</TabsTrigger>
              <TabsTrigger value="pending">На согласовании ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="archive">Архив ({archivedCourses.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeCourses.length === 0 ? (
                <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
                  Нет активных назначенных курсов.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {activeCourses.map((course) => (
                    <Card key={course.courseId ?? course.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
                      <div
                        className="aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center"
                        style={{
                          backgroundImage: course.courseCoverUrl ? `url(${course.courseCoverUrl})` : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {!course.courseCoverUrl && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <BookOpen className="h-5 w-5" />
                            <span className="text-sm font-medium">Курс</span>
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="outline" className="text-xs">
                            {course.courseCategoryId ?? "Без категории"}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {course.courseDifficulty ?? "—"}
                          </Badge>
                        </div>
                        <h3 className="line-clamp-2 font-bold leading-tight">{course.courseTitle ?? "Без названия"}</h3>
                        <p className="text-sm text-muted-foreground">
                          Статус: {course.status ?? "ASSIGNED"}
                        </p>
                      </CardHeader>
                      <CardContent className="flex-1 p-4 pt-2">
                        <div className="text-xs text-muted-foreground mb-2">
                          Длительность: {durationLabel(course.courseDurationMinutes)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {course.courseDescription || "Описание пока не заполнено."}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        {course.courseId ? (
                          <Button variant="outline" className="w-full" asChild>
                            <a href={`/course/${course.courseId}`}>Подробнее</a>
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full" disabled>
                            Подробнее
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {pendingRequests.length === 0 ? (
                <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
                  Заявок на согласовании нет.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingRequests.map((request) => (
                    <Card key={request.id} className="flex flex-col overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
                        <Badge className="bg-amber-500">На модерации</Badge>
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <h3 className="line-clamp-2 font-bold leading-tight">{request.courseTitle ?? request.courseId}</h3>
                        <p className="text-sm text-muted-foreground">
                          Отправлено: {request.createdAt ? new Date(request.createdAt).toLocaleDateString("ru-RU") : "-"}
                        </p>
                      </CardHeader>
                      <CardContent className="flex-1 p-4 pt-2">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {request.comment || "Комментарий не указан."}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        {request.courseId ? (
                          <Button variant="outline" className="w-full" asChild>
                            <a href={`/course/${request.courseId}`}>Открыть курс</a>
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full" disabled>
                            Курс недоступен
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="archive">
              {archivedCourses.length === 0 ? (
                <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
                  Архив пока пуст.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {archivedCourses.map((course) => (
                    <Card key={course.courseId ?? course.id} className="flex flex-col overflow-hidden opacity-90">
                      <div
                        className="aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center"
                        style={{
                          backgroundImage: course.courseCoverUrl ? `url(${course.courseCoverUrl})` : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {!course.courseCoverUrl && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <BookOpen className="h-5 w-5" />
                            <span className="text-sm font-medium">Курс</span>
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="outline" className="text-xs">
                            {course.courseCategoryId ?? "Без категории"}
                          </Badge>
                          <Badge variant="destructive" className="text-xs">
                            В архиве
                          </Badge>
                        </div>
                        <h3 className="line-clamp-2 font-bold leading-tight">{course.courseTitle ?? "Без названия"}</h3>
                        <p className="text-sm text-muted-foreground">
                          Статус: {course.status ?? "ASSIGNED"}
                        </p>
                      </CardHeader>
                      <CardContent className="flex-1 p-4 pt-2">
                        <div className="text-xs text-muted-foreground mb-2">
                          Длительность: {durationLabel(course.courseDurationMinutes)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {course.courseDescription || "Описание пока не заполнено."}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        {course.courseId ? (
                          <Button variant="outline" className="w-full" asChild>
                            <a href={`/course/${course.courseId}`}>Подробнее</a>
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full" disabled>
                            Подробнее
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
