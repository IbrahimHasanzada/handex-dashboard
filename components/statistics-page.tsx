"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Users,
  GraduationCap,
  BookOpen,
  ArrowUpRight,
  ContactRound,
  SquarePen,
  Check,
  X
} from "lucide-react"
import { useGeneralMutation, useGetGeneralQuery } from "@/store/handexApi"
import { Button } from "./ui/button"
import { useState } from "react"
import { Input } from "./ui/input"

export function StatisticsPage() {
  const [edit, setEdit] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState("")

  const { data: general, refetch: fetchStatistics, isFetching } = useGetGeneralQuery('')
  const [addStatistic, { isError, isSuccess, data }] = useGeneralMutation()




  const handleAddStatistic = async () => {
    if (edit === null) return

    const statKeys = ["students", "workers", "graduates", "teachers"]
    const keyToUpdate = statKeys[edit]

    const currentStats = general?.[0]?.statistics || {
      students: 0,
      workers: 0,
      graduates: 0,
      teachers: 0
    }

    const updatedStatistics = {
      ...currentStats,
      [keyToUpdate]: inputValue
    }


    await addStatistic({ statistics: updatedStatistics })

    setInputValue("")
    setEdit(null)
    fetchStatistics()
  }

  const handleEditClick = (index: number, currentValue: number) => {
    setEdit(index)
    setInputValue(currentValue?.toString() || "")
  }

  const allStatistics = [
    { icons: Users, dataStat: general?.[0]?.statistics?.students, title: "Ümumi Tələbələr" },
    { icons: BookOpen, dataStat: general?.[0]?.statistics?.workers, title: "Tələbələrimizin aldıqları sertifikatların sayı" },
    { icons: GraduationCap, dataStat: general?.[0]?.statistics?.graduates, title: "İş tapan məzunların sayı" },
    { icons: ContactRound, dataStat: general?.[0]?.statistics?.teachers, title: "Müəllimlərin sayı" },
  ]

  return (

    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Statistika</h1>
          <p className="text-muted-foreground">Sayt və kurslar haqqında ətraflı statistika</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {allStatistics.map((item, index: number) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex gap-2 items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  {<item.icons className="h-6 w-6 text-primary" />}
                </div>
                <div>
                  {edit === index ?
                    <div className="flex gap-1">
                      <Button onClick={handleAddStatistic} variant="outline"><Check stroke="blue" /> Əlavə et</Button>
                      <Button onClick={() => setEdit(null)} variant="outline"><X stroke="red" /> Ləğv et</Button>
                    </div>
                    :
                    <div>
                      <Button onClick={() => handleEditClick(index, item.dataStat)} variant="outline"><SquarePen /> Redaktə Et</Button>
                    </div>
                  }
                </div>
              </div>
              <div className="mt-4">
                {edit === index ?
                  (
                    <div className="my-2">
                      <Input
                        type="text"
                        placeholder="Rəqəm daxil edin..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">{isFetching ? 'loading...' : item.dataStat}</div>
                  )
                }
                <div className="text-sm text-muted-foreground">{item.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}