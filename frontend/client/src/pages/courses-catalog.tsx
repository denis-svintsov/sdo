import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { AssignedCourseDto, fetchAssignedCourses } from "@/lib/coursesApi";

export default function CoursesCatalog() {
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assigned-courses", user?.id],
    queryFn: () => fetchAssignedCourses(),
    enabled: !!user?.id,
  });

  const courses = (data ?? []) as AssignedCourseDto[];

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
        {!isLoading && !isError && courses.length === 0 && (
          <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            Пока нет назначенных курсов.
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
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
      </div>
    </Layout>
  );
}
