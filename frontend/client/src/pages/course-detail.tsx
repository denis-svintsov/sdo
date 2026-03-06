import { useParams } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { fetchCourse } from "@/lib/coursesApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function CourseDetail() {
  const params = useParams();
  const courseId = params?.id as string | undefined;
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => {
      if (!courseId) return Promise.reject(new Error("Course id missing"));
      return fetchCourse(courseId);
    },
    enabled: !!courseId,
  });

  const isAdmin = (user?.roles ?? []).includes("ADMIN");

  if (isLoading) {
    return (
      <Layout>
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          Загрузка курса...
        </div>
      </Layout>
    );
  }

  if (isError || !data) {
    return (
      <Layout>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Не удалось загрузить курс. {(error as Error)?.message}
        </div>
      </Layout>
    );
  }

  const durationLabel = data.durationMinutes
    ? `${Math.round((data.durationMinutes / 60) * 10) / 10} ч`
    : "—";

  return (
    <Layout>
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border bg-card">
          <div
            className="h-56 w-full bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200"
            style={{
              backgroundImage: data.coverUrl ? `url(${data.coverUrl})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{data.status ?? "ACTIVE"}</Badge>
              <Badge variant="outline">{data.difficulty ?? "—"}</Badge>
              <Badge variant="outline">{durationLabel}</Badge>
              {data.specialization && (
                <Badge variant="outline">{data.specialization}</Badge>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{data.title}</h1>
              <p className="mt-2 text-muted-foreground">
                {data.description || "Описание пока не заполнено."}
              </p>
            </div>
            {isAdmin && data.companyCost != null && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Стоимость для компании</div>
                <div className="text-lg font-semibold">{data.companyCost.toLocaleString("ru-RU")} ₽</div>
              </div>
            )}
            {data.aggregatorUrl && (
              <Button asChild className="w-full md:w-auto">
                <a href={data.aggregatorUrl} target="_blank" rel="noreferrer">
                  Перейти к обучению
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-3">
          <h2 className="text-xl font-semibold">Инструкции</h2>
          <p className="text-muted-foreground whitespace-pre-line">
            {data.instructions || "Инструкции пока не заполнены."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
