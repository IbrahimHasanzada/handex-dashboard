import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetGeneralQuery } from '@/store/handexApi'
import { Edit, Plus } from 'lucide-react'
import Image from 'next/image'


const partners = () => {
    const { data: partners, refetch: fetchStatistics, isFetching } = useGetGeneralQuery('')
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Tərəfdaşlar</CardTitle>
                    <CardDescription>Tərəfdaş şirkətləri idarə edin</CardDescription>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Yeni Tərəfdaş
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {partners?.map((partner: any) => (
                        <div key={partner.id} className="border rounded-lg p-4 flex flex-col items-center">
                            <div className="relative">
                                <Image
                                    src={partner.logo || "/placeholder.svg"}
                                    alt={partner.name}
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

export default partners
