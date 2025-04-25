import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetGeneralQuery } from "@/store/handexApi"
import { Edit } from "lucide-react"
import Image from "next/image"
import { AddPartner } from "./add-partners"

const Partners = () => {
    const { data: partners, refetch: fetchPartners, isFetching } = useGetGeneralQuery("")

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Tərəfdaşlar</CardTitle>
                    <CardDescription>Tərəfdaş şirkətləri idarə edin</CardDescription>
                </div>
                <AddPartner onSuccess={fetchPartners} />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {partners?.map((partner: any) => (
                        <div key={partner.id} className="border rounded-lg p-4 flex flex-col items-center">
                            <div className="relative">
                                <Image
                                    src={partner.logo || "/placeholder.svg"}
                                    alt={"partner" + partner.name}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                                <div className="absolute -bottom-2 -right-2 flex gap-1">
                                    <Button size="icon" variant="secondary" className="h-6 w-6">
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                            <div className="font-medium text-center mt-3">{partner.name}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default Partners
