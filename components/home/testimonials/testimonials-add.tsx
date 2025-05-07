"use client"
import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { useAddCustomersMutation, useUploadFileMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import { validateImage } from "@/validations/upload.validation"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { testimonialFormSchema, TestimonialFormValues } from "@/validations/home/testimonials.validation"

export const TestimonialsAdd: React.FC<any> = ({ addData, setAddData, refetch, currentLanguage }) => {
  const [activeTab, setActiveTab] = useState("az")
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [bankPreview, setBankPreview] = useState<string | null>(null)
  const [uploadImage, { isLoading }] = useUploadFileMutation()
  const [addCustomers, { isLoading: addLoading }] = useAddCustomersMutation()

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      bank_name: "",
      translations: [
        { comment: "", lang: "az" },
        { comment: "", lang: "en" },
        { comment: "", lang: "ru" }
      ],
      customer_profile: -1,
      bank_logo: -1
    }
  })

  const handleFileChange = async (field: "customer_profile" | "bank_logo", file: File | null) => {
    if (!file) {
      if (field === "customer_profile") {
        setProfilePreview(null)
        form.setValue(field, -1)
      } else {
        setBankPreview(null)
        form.setValue(field, -1)
      }
      return
    }

    const validationResult = validateImage(file, null, null)
    if (validationResult === false) {
      toast.error("Şəkil yüklənərkən xəta baş verdi")
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await uploadImage(formData).unwrap()

      if (!isLoading) {
        if (field === "customer_profile") {
          setProfilePreview(response.url)
        } else {
          setBankPreview(response.url)
        }
        form.setValue(field, response.id, { shouldValidate: true })
      }
    } catch (error) {
      toast.error("Şəkil yüklənərkən xəta baş verdi")
    }
  }

  const onSubmit = async (data: TestimonialFormValues) => {
    try {
      await addCustomers(data).unwrap()
      toast.success('Rəy uğurla əlavə edildi!')
      await refetch()
      setAddData(false)
      form.reset()
      setProfilePreview(null)
      setBankPreview(null)
    } catch (error: any) {
      toast.error("Xəta baş verdi")
    }
  }

  return (
    <Dialog open={addData} onOpenChange={setAddData}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Yeni Rəy Əlavə Et</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full max-w-3xl mx-auto">
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Profile Image */}
                  <FormField
                    control={form.control}
                    name="customer_profile"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="customer_profile">Müştəri Profil Şəkli *</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-40 relative">
                            {profilePreview ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={profilePreview}
                                  alt="Customer profile preview"
                                  fill
                                  className="object-contain rounded-full"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-0 right-0 bg-white rounded-full"
                                  onClick={() => handleFileChange("customer_profile", null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">Şəkil yükləmək üçün klikləyin və ya sürükləyin</p>
                                <input
                                  id="customer_profile"
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  onChange={(e) => handleFileChange("customer_profile", e.target.files?.[0] || null)}
                                />
                              </>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bank Logo */}
                  <FormField
                    control={form.control}
                    name="bank_logo"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="bank_logo">Şirkət Logosu *</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-40 relative">
                            {bankPreview ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={bankPreview}
                                  alt="Bank logo preview"
                                  fill
                                  className="object-contain"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-0 right-0 bg-white rounded-full"
                                  onClick={() => handleFileChange("bank_logo", null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">Şəkil yükləmək üçün klikləyin və ya sürükləyin</p>
                                <input
                                  id="bank_logo"
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  onChange={(e) => handleFileChange("bank_logo", e.target.files?.[0] || null)}
                                />
                              </>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Customer Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Müştəri Adı *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bank Name */}
                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Şirkət Adı *</FormLabel>
                      <FormControl>
                        <Input placeholder="Handex MMC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Testimonial Text with Language Tabs */}
                <div className="space-y-2">
                  <Label>Rəy Mətni *</Label>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-2">
                      <TabsTrigger value="az">AZ</TabsTrigger>
                      <TabsTrigger value="en">EN</TabsTrigger>
                      <TabsTrigger value="ru">RU</TabsTrigger>
                    </TabsList>

                    <TabsContent value="az">
                      <FormField
                        control={form.control}
                        name={`translations.0.comment`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Rəy mətnini daxil edin..."
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="en">
                      <FormField
                        control={form.control}
                        name={`translations.1.comment`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Enter testimonial text..."
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="ru">
                      <FormField
                        control={form.control}
                        name={`translations.2.comment`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Введите текст отзыва..."
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Button type="submit">{
                  addLoading
                    ?
                    <span className="flex items-center">
                      <Loader2 className="animate-spin h-4 w-4 mr-1" />
                      Əlavə edilir...
                    </span>
                    :
                    <span>
                      Əlavə et
                    </span>
                }</Button>
                <Button onClick={() => setAddData(false)} type="button" variant="outline">
                  Ləğv Et
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}