"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Award, Loader2, Box, ArrowLeft, Trash } from "lucide-react"
import type { CourseOverviewProps } from "@/types/study-area/overview"
import { useDeleteProgramMutation, useGetStudyAreaBySlugQuery, useGetStudyAreaFaqQuery, useGetStudyAreaGroupsQuery, useGetStudyAreaItemQuery, useGetStudyAreaProfileQuery, useGetStudyAreaProgramsQuery, useUpdateStudyAreaMutation } from "@/store/handexApi"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import Link from "next/link"
import { FAQList } from "./faq/faq-list"
import { GroupList } from "./group/group-list"
import { ProgramForm } from "./program/program-form"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { EditHero } from "./edit-hero"
import { MetaIntegration } from "./meta/meta-integration"
import StatisticsSection from "../home/statistics/StatisticsSection"
import Instructors from "./teachers/instructors"
import BrochureForm from "./brochure"

interface MetaTranslation {
    name: string
    value: string
    lang: string
}

interface MetaItem {
    id?: number
    translations: MetaTranslation[]
}

export function CourseOverview({ slug }: CourseOverviewProps) {
    const [selectedLanguage, setSelectedLanguage] = useState("az")
    const [isProgramFormOpen, setIsProgramFormOpen] = useState(false)
    const [isStudyAreaEditOpen, setIsStudyAreaEditOpen] = useState(false)
    const [editingProgram, setEditingProgram] = useState<{
        id: number
        name: string
        image: { id: number; url: string; alt: string | null }
        description: string
    } | null>(null)

    // const { data, isLoading, isError, refetch, isFetching } = useGetStudyAreaBySlugQuery(
    //     { slug: slug, lang: selectedLanguage },
    //     { skip: !slug },
    // )
    const { data: programsData, isLoading, isError, refetch, isFetching } = useGetStudyAreaProgramsQuery({ slug, lang: selectedLanguage }, { skip: !slug })
    const { data: groupsData, isLoading: groupsLoading, isError: groupsError, refetch: groupsFetch } = useGetStudyAreaGroupsQuery({ slug, lang: selectedLanguage }, { skip: !slug })
    const { data: faqData, isLoading: faqLoading, isError: faqError, refetch: faqFetch } = useGetStudyAreaFaqQuery({ slug, lang: selectedLanguage }, { skip: !slug })
    const { data: itemData, isLoading: itemLoading, isError: itemError, refetch: itemFetch } = useGetStudyAreaItemQuery({ slug, lang: selectedLanguage }, { skip: !slug })
    const { data: profileData, isLoading: profileLoading, isError: profileError, refetch: profileFetch } = useGetStudyAreaProfileQuery({ slug, lang: selectedLanguage }, { skip: !slug })
    const [deleteProgram] = useDeleteProgramMutation()
    const [updateStudyArea, { isLoading: updateLoading }] = useUpdateStudyAreaMutation()
    const onEdit = () => setIsStudyAreaEditOpen(true)

    const onEditProgram = (id: number) => {
        const program = programsData.find((p: any) => p.id === id)
        if (program) {
            setEditingProgram({
                id: program.id,
                name: program.name,
                image: program.image || { id: 0, url: "", alt: null },
                description: program.description,
            })
            setIsProgramFormOpen(true)
        }
    }

    const onAddProgram = () => {
        setEditingProgram(null)
        setIsProgramFormOpen(true)
    }

    const handleProgramFormClose = () => {
        setIsProgramFormOpen(false)
        setEditingProgram(null)
    }

    const handleStudyAreaEditClose = () => setIsStudyAreaEditOpen(false)
    const handleProgramSuccess = () => refetch()
    const handleStudyAreaSuccess = () => itemFetch()
    const handleDeleteProgram = (id: number) => {
        try {
            showDeleteConfirmation(deleteProgram, id, refetch, {
                title: "Proqramı silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Proqram uğurla silindi.",
            })
        } catch (error) {
            console.error("Error:", error)
            toast.error("Proqram silərkən xəta baş verdi")
        }
    }

    const handleCreateMeta = async (metaData: MetaItem) => {
        try {
            const filteredTranslations = metaData.translations.filter((t) => t.value.trim())

            if (filteredTranslations.length === 0) {
                throw new Error("Ən azı bir dil üçün dəyər daxil edin")
            }

            const apiData = {
                meta: [
                    {
                        translations: filteredTranslations,
                    },
                ],
            }


            await updateStudyArea({ params: apiData, id: itemData.id }).unwrap()
            toast.success("Meta uğurla əlavə edildi")
            refetch()
        } catch (error) {
            throw new Error("Meta yaradılarkən xəta baş verdi")
        }
    }

    const handleUpdateMeta = async (metaData: MetaItem) => {
        try {
            const filteredTranslations = metaData.translations.filter((t) => t.value.trim())

            if (filteredTranslations.length === 0) {
                throw new Error("Ən azı bir dil üçün dəyər daxil edin")
            }

            const apiData = {
                meta: [
                    {
                        translations: filteredTranslations,
                    },
                ],
            }
            await updateStudyArea({ id: itemData.id, params: apiData }).unwrap()
            refetch()
            toast.success("Meta uğurla redaktə edildi")
        } catch (error: any) {
            toast.error("Meta redaktə olunarkən xəta baş verdi \n" + error.data.message)
            throw new Error("Meta yenilənərkən xəta baş verdi")
        }
    }

    const metaItems: MetaItem[] = itemData?.meta || []

    return (
        <div className="space-y-6 p-10">
            <div className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/study-area">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Tədris sahələrinə qayıt
                    </Link>
                </Button>
                <Tabs defaultValue={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value)}>
                    <TabsList>
                        <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ru">Русский</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
            ) : isError ? (
                <div>
                    <div className="flex w-full justify-center items-center">Məlumatları yükləyərkən xəta baş verdi</div>
                </div>
            ) : itemData ? (
                <div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    {itemData && itemData.name}
                                    <Badge variant="secondary" style={{ backgroundColor: `${itemData.color}20`, color: itemData.color }}>
                                        {itemData.slug}
                                    </Badge>
                                </CardTitle>
                            </div>
                            <Button variant="outline" onClick={onEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Redaktə Et
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="font-medium text-sm text-muted-foreground">Kurs Adı</div>
                                            <div className="font-semibold">{itemData.name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="font-medium text-sm text-muted-foreground">Slug</div>
                                            <div className="text-sm font-mono bg-muted px-2 py-1 rounded">{itemData.slug}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="font-medium text-sm text-muted-foreground">Kurs Təfərrüatı</div>
                                            <div className="text-sm leading-relaxed">{itemData.course_detail}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="font-medium text-sm text-muted-foreground">Rəng</div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded border" style={{ backgroundColor: itemData.color }} />
                                                <span className="font-mono text-sm">{itemData.color}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative w-full max-w-[300px] aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                        src={itemData.image?.url || "/placeholder.svg"}
                                        alt={itemData.image ? itemData.image.alt : "tədris sahəsi şəkil alt tagı"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Program Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Proqram Modulları
                                </CardTitle>
                                <CardDescription>Kurs proqramının modullarını idarə edin</CardDescription>
                            </div>
                            <Button onClick={onAddProgram}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yeni Modul
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {programsData.map((program: any, index: number) => (
                                    <div key={program.id} className="flex items-start gap-4 border rounded-lg p-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium">{program.name}</div>
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" onClick={() => onEditProgram(program.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {programsData.length > 1 &&
                                                        <Button size="icon" variant="ghost" onClick={() => handleDeleteProgram(program.id)}>
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                </div>
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{program.description}</div>
                                        </div>
                                    </div>
                                ))}
                                {programsData.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>Hələ proqram modulu əlavə edilməyib</p>
                                        <p className="text-sm">İlk modulunuzu əlavə etmək üçün yuxarıdakı düyməni basın</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardContent>
                            <BrochureForm studyAreaId={itemData?.id} />
                        </CardContent>
                    </Card>

                    {/* Groups Section */}
                    <GroupList
                        studyArea={itemData?.id}
                        groups={groupsData}
                        selectedLanguage={selectedLanguage}
                        courseColor={itemData?.color}
                        onRefresh={groupsFetch}
                    />

                    {/* FAQ Section */}
                    <div className="space-y-4">
                        <FAQList areaStudy={itemData?.id} faqs={faqData} selectedLanguage={selectedLanguage} onRefresh={faqFetch} />
                        {faqData.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Hələ FAQ əlavə edilməyib</p>
                                <p className="text-sm">İlk sualınızı əlavə etmək üçün yuxarıdakı düyməni basın</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex w-full justify-center items-center">
                    <Box>Heç bir məlumat tapılmadı</Box>
                </div>
            )}

            <Instructors
                isError={isError}
                isLoading={isLoading}
                refetch={profileFetch}
                instructorsData={profileData}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                studyArea={itemData?.id}
            />

            {/* Statistics Section */}
            <StatisticsSection studyArea={itemData?.id} field={slug} />

            {/* Program Form Modal */}
            <ProgramForm
                isOpen={isProgramFormOpen}
                onClose={handleProgramFormClose}
                studyAreaId={itemData?.id}
                programId={editingProgram?.id}
                initialData={editingProgram}
                selectedLanguage={selectedLanguage}
                onSuccess={handleProgramSuccess}
            />


            {/* Meta Management Section */}
            <MetaIntegration
                studyAreaId={itemData?.id}
                selectedLanguage={selectedLanguage}
                onRefresh={itemFetch}
                metaItems={metaItems}
                onCreateMeta={handleCreateMeta}
                onUpdateMeta={handleUpdateMeta}
                isLoading={isFetching}
            />


            {/* Study Area Edit Form Modal */}
            {itemData && (
                <EditHero
                    isOpen={isStudyAreaEditOpen}
                    onClose={handleStudyAreaEditClose}
                    studyAreaId={itemData.id}
                    initialData={{
                        name: itemData.name,
                        slug: itemData.slug,
                        color: itemData.color,
                        image: itemData.image,
                        course_detail: itemData.course_detail,
                    }}
                    selectedLanguage={selectedLanguage}
                    onSuccess={handleStudyAreaSuccess}
                />
            )}
        </div>
    )
}
