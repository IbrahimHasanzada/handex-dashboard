"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Save, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAddRedirectMutation, useDeleteRedirectMutation, useGetRedirectsQuery } from "@/store/handexApi"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"

interface Redirect {
    from: string
    to: string
    isPermanent: boolean
}

export function RedirectManager() {

    const { data: redirectsData, isLoading: redirectLoading, isError, refetch } = useGetRedirectsQuery("az")
    const [addRedirectMut, { isLoading: addLoading }] = useAddRedirectMutation()
    const [delRedirects] = useDeleteRedirectMutation()

    const [newRedirect, setNewRedirect] = useState<Redirect>({
        from: "",
        to: "",
        isPermanent: true,
    })
    const addRedirect = async () => {
        if (!newRedirect.from || !newRedirect.to) {
            toast.error("Both source and destination URLs are required")
            return
        }

        try {
            await addRedirectMut(newRedirect).unwrap()
            toast.success("Redirect uğurla əlavə edildi")
            setNewRedirect({
                from: "",
                to: "",
                isPermanent: true,
            })
            refetch()
        } catch (error: any) {
            toast.error(error.message)
        }

    }

    const removeRedirect = (id: number) => {
        showDeleteConfirmation(delRedirects, id, refetch, {
            title: "Redirecti silmək istəyirsinizmi?",
            text: "Bu əməliyyat geri qaytarıla bilməz!",
            successText: "Redirect uğurla silindi.",
        })
    }


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Yeni Redirect əlavə et</CardTitle>
                    <CardDescription>Bir URL-dən digərinə 301 daimi yönləndirməni konfiqurasiya edin</CardDescription>
                    <CardDescription>Zəhmət olmasa redirect əlavə edəndə hər dil üçün əlavə edin!(Məs: /az, /en, /ru)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="from">Mənbə URL</Label>
                                <Input
                                    id="from"
                                    placeholder="example.com"
                                    value={newRedirect.from}
                                    onChange={(e) => setNewRedirect({ ...newRedirect, from: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="to">Təyinat URL</Label>
                                <Input
                                    id="to"
                                    placeholder="new-example.com"
                                    value={newRedirect.to}
                                    onChange={(e) => setNewRedirect({ ...newRedirect, to: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="permanent"
                                checked={newRedirect.isPermanent}
                                onCheckedChange={(checked) => setNewRedirect({ ...newRedirect, isPermanent: checked })}
                            />
                            <Label htmlFor="permanent">301 Daimi Yönləndirmə (SEO üçün tövsiyə olunur)</Label>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setNewRedirect({ from: "", to: "", isPermanent: true })}>
                        Sıfırlayın
                    </Button>
                    <Button onClick={addRedirect}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Əlavə et
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Konfiqurasiya edilmiş yönləndirmələr</CardTitle>
                    </div>
                    <CardDescription>
                        {redirectsData?.length} redirect{redirectsData?.length !== 1 ? "s" : ""} konfiqurasiya edilib
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {redirectsData?.length === 0 ? (
                            <div className="text-center py-6 text-gray-500">Hələ heç bir yönləndirmə konfiqurasiya edilməyib</div>
                        ) : redirectLoading ?
                            <div className="flex items-center justify-center p-10">
                                <Loader2 className="animate-spin h-10 w-10" />
                            </div>
                            : (
                                redirectsData?.map((redirect: any) => (
                                    <div
                                        key={redirect.id}
                                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="space-y-2 md:space-y-0 md:flex md:items-center md:space-x-4 flex-grow">
                                            <div className="flex-grow">
                                                <p className="font-medium">{redirect.from}</p>
                                                <p className="text-sm text-gray-500">→ {redirect.to}</p>
                                            </div>
                                            <Badge variant={redirect.isPermanent ? "default" : "outline"}>
                                                {redirect.isPermanent ? "301 Permanent" : "302 Temporary"}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="mt-2 md:mt-0 self-end md:self-auto"
                                            onClick={() => removeRedirect(redirect.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
