import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Calendar, Star, Clock } from "lucide-react";
import { COURSES } from "@/lib/mock-data";
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function CoursesCatalog() {
  const [priceRange, setPriceRange] = useState([50000]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-secondary">Каталог курсов</h1>
            <p className="text-muted-foreground">Более 5000 курсов от ведущих образовательных платформ</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">По релевантности</SelectItem>
                <SelectItem value="rating">По рейтингу</SelectItem>
                <SelectItem value="price_asc">Сначала дешевле</SelectItem>
                <SelectItem value="price_desc">Сначала дороже</SelectItem>
                <SelectItem value="date">По дате начала</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <Card className="h-fit lg:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2 font-semibold">
                <Filter className="h-4 w-4" />
                Фильтры
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Поиск</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Ключевые слова..." className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Провайдер</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="p1" />
                    <Label htmlFor="p1">Stepik</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="p2" />
                    <Label htmlFor="p2">Coursera</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="p3" />
                    <Label htmlFor="p3">Яндекс.Практикум</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="p4" />
                    <Label htmlFor="p4">Skillbox</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Стоимость до</Label>
                  <span className="text-sm text-muted-foreground">{priceRange[0].toLocaleString()} ₽</span>
                </div>
                <Slider 
                  max={150000} 
                  step={1000} 
                  value={priceRange} 
                  onValueChange={setPriceRange}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Формат</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f1" />
                    <Label htmlFor="f1">Онлайн</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f2" />
                    <Label htmlFor="f2">Оффлайн</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f3" />
                    <Label htmlFor="f3">Гибридный</Label>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">Применить</Button>
            </CardContent>
          </Card>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {COURSES.map((course) => (
                <Card key={course.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="text-xs">{course.category}</Badge>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs font-medium">{course.rating}</span>
                      </div>
                    </div>
                    <h3 className="line-clamp-2 font-bold leading-tight">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.provider}</p>
                  </CardHeader>
                  <CardContent className="flex-1 p-4 pt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3" />
                      {format(course.dates.start, 'd MMM', { locale: ru })} - {format(course.dates.end, 'd MMM yyyy', { locale: ru })}
                    </div>
                    <div className="font-bold text-primary">
                      {course.price.toLocaleString()} {course.currency === 'RUB' ? '₽' : course.currency}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full">Подробнее</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
