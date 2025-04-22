"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetaTranslationItem } from "@/types/home/hero.dto"
import { useAddHeroMutation, useGetHeroHomeQuery } from "@/store/handexApi"


const HomeHero = () => {
    const [activeLanguage, setActiveLanguage] = useState<string>("az")
    const { data: heroData, refetch: fetchHero, isFetching, isLoading } = useGetHeroHomeQuery(activeLanguage, { skip: false })
    const [addHero, { data: addHeroData }] = useAddHeroMutation()
    const [isEditing, setIsEditing] = useState(false)
    const [metaChange, setMetaChange] = useState<MetaTranslationItem>()
    const [title, setTitle] = useState<string>()
    const [text, setText] = useState<string>()

    useEffect(() => {
        fetchHero()
        if (!isLoading && heroData) {
            setTitle(heroData?.[0].title)
            setText(heroData?.[0].desc)
        }
    }, [isEditing, heroData])

    const handleSave = async () => {
        const newBannerData = {
            translations: [{
                title: title,
                desc: text,
                lang: activeLanguage
            }],
            meta: [{
                translations: [
                    {
                        name: "hero",
                        value: metaChange?.value,
                        lang: activeLanguage
                    }
                ]
            }],
        }

        await addHero({ params: newBannerData, id: heroData?.[0].id });

        console.log(heroData);


        setIsEditing(false);
    };

    const handleMetaChange = (lang: string, name: string, value: string) => setMetaChange({ lang, name, value })
    const editHero = () => setIsEditing(!isEditing)

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Ana Səhifə Banner</CardTitle>
                    <CardDescription>Saytın əsas banner bölməsini idarə edin</CardDescription>
                </div>
                {isEditing ? (
                    <div className="space-x-2">
                        <Button variant="outline" onClick={editHero}>
                            Ləğv Et
                        </Button>
                        <Button onClick={handleSave}>Yadda Saxla</Button>
                    </div>
                ) : (
                    <Button variant="outline" onClick={editHero}>
                        Redaktə Et
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="space-y-6">
                        <Tabs defaultValue="az" value={activeLanguage} onValueChange={setActiveLanguage}>
                            <TabsList className="mb-4">
                                <TabsTrigger value="az">Azərbaycan</TabsTrigger>
                                <TabsTrigger value="en">English</TabsTrigger>
                                <TabsTrigger value="ru">Русский</TabsTrigger>
                            </TabsList>

                            <TabsContent value={activeLanguage} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="font-medium text-sm text-muted-foreground">Başlıq</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-medium text-sm text-muted-foreground">Alt Başlıq</label>
                                    <Textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-medium text-sm text-muted-foreground">Meta</label>
                                    <Input
                                        value={metaChange?.value}
                                        onChange={(e) => handleMetaChange(activeLanguage, "hero-meta", e.target.value)}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="relative w-full max-w-[300px] aspect-video bg-purple-100 rounded-lg flex items-center justify-center">
                            <Image
                                src={heroData?.[0].images[0].url || "/placeholder.svg?height=200&width=300"}
                                alt="Banner image"
                                width={300}
                                height={200}
                                className="object-contain"
                            />
                            <div className="absolute bottom-2 right-2">
                                <Button size="sm" variant="secondary">
                                    Şəkli Dəyişdir
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <div className="space-y-2">
                                <div className="font-medium text-sm text-muted-foreground">Başlıq</div>
                                <div className="font-semibold">{heroData?.[0].title}</div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <div className="font-medium text-sm text-muted-foreground">Alt Başlıq</div>
                                <div className="text-sm">{heroData?.[0].desc}</div>
                            </div>

                            <div className="mt-4">
                                <Tabs defaultValue="az" value={activeLanguage} onValueChange={setActiveLanguage}>
                                    <TabsList>
                                        <TabsTrigger value="az">AZ</TabsTrigger>
                                        <TabsTrigger value="en">EN</TabsTrigger>
                                        <TabsTrigger value="ru">RU</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                        <div className="relative w-full max-w-[300px] aspect-video bg-purple-100 rounded-lg flex items-center justify-center">
                            <Image
                                src={heroData?.[0].images[0].url || "/placeholder.svg?height=200&width=300"}
                                alt="Banner image"
                                width={300}
                                height={200}
                                className="object-contain"
                            />
                            <div className="absolute bottom-2 right-2">
                                <Button size="sm" variant="secondary">
                                    Şəkli Dəyişdir
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default HomeHero
