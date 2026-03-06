import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Award, ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchMyCertificates, fetchMyProgress } from "@/lib/coursesApi";
import { useMemo } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: progressData } = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => fetchMyProgress(user!.id),
    enabled: !!user?.id,
  });
  const { data: certificates } = useQuery({
    queryKey: ["certificates", user?.id],
    queryFn: () => fetchMyCertificates(user!.id),
    enabled: !!user?.id,
  });

  const activeCourse = useMemo(() => {
    const courses = progressData?.courses ?? [];
    if (courses.length === 0) return null;
    return courses.reduce((best, current) =>
      current.progressPercentage > best.progressPercentage ? current : best,
    );
  }, [progressData]);

  const completedLessons = progressData?.courses?.reduce(
    (sum, course) => sum + course.completedLessons,
    0,
  ) ?? 0;

  const selectedCount = progressData?.courses?.length ?? 0;
  const certificatesCount = certificates?.length ?? 0;
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-secondary">Дашборд</h1>
          <Button asChild>
            <Link href="/catalog">Подобрать курсы</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Выбрано курсов</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedCount}/3</div>
              <p className="text-xs text-muted-foreground">
                {selectedCount >= 3 ? "Лимит достигнут" : `Необходимо выбрать еще ${3 - selectedCount}`}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Пройдено уроков</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedLessons}</div>
              <p className="text-xs text-muted-foreground">Суммарно по активным курсам</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Сертификаты</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificatesCount}</div>
              <p className="text-xs text-muted-foreground">Всего получено</p>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Бюджет отдела</CardTitle>
              <span className="text-2xl font-bold">₽</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">45%</div>
              <p className="text-xs text-white/80">Использовано в этом квартале</p>
            </CardContent>
          </Card>
        </div>

        {/* Attention Required */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Требует внимания</CardTitle>
              <CardDescription>Задачи, которые необходимо выполнить в ближайшее время</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-accent/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Завершите выбор курсов</h4>
                    <p className="text-sm text-muted-foreground">Период выбора Q3 2024 заканчивается через 3 дня</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/selection">Перейти</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Загрузите сертификат</h4>
                    <p className="text-sm text-muted-foreground">По курсу "Python Basic"</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Загрузить</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Ближайший курс</CardTitle>
              <CardDescription>До начала осталось 5 дней</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!activeCourse && (
                <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                  Нет активных курсов в прогрессе.
                </div>
              )}
              {activeCourse && (
                <>
                  <div className="aspect-video w-full overflow-hidden rounded-md bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Активный курс</Badge>
                      <span className="text-sm text-muted-foreground">В процессе</span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-2">{activeCourse.courseTitle}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Прогресс по курсу: {activeCourse.progressPercentage}%
                    </p>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Прогресс подготовки</span>
                      <span className="font-medium">{activeCourse.progressPercentage}%</span>
                    </div>
                    <Progress value={activeCourse.progressPercentage} className="h-2" />
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link href={`/course/${activeCourse.courseId}`}>
                      Перейти к материалам <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
