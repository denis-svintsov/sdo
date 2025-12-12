import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Search, FileText, Calendar } from "lucide-react";

export default function Certificates() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-secondary">Мои сертификаты</h1>
            <p className="text-muted-foreground">Загружайте и просматривайте полученные сертификаты</p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Загрузить сертификат
          </Button>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск по названию..."
                className="pl-9"
              />
            </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Mock Certificate 1 */}
            <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-[4/3] bg-muted relative flex items-center justify-center p-8 bg-slate-100">
                    <FileText className="h-16 w-16 text-slate-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1">Основы Python</h3>
                    <p className="text-sm text-muted-foreground">Stepik</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> 12.05.2023
                        </span>
                        <span>72 ч.</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4 h-8 text-xs">Скачать PDF</Button>
                </CardContent>
            </Card>

            {/* Mock Certificate 2 */}
            <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-[4/3] bg-muted relative flex items-center justify-center p-8 bg-slate-100">
                     <FileText className="h-16 w-16 text-slate-300" />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1">Agile Management</h3>
                    <p className="text-sm text-muted-foreground">Coursera</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> 20.08.2023
                        </span>
                         <span>40 ч.</span>
                    </div>
                     <Button variant="outline" className="w-full mt-4 h-8 text-xs">Скачать PDF</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </Layout>
  );
}
