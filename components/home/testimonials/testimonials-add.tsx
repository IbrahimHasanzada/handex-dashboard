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
import { testimonialFormSchema, type TestimonialFormValues } from "@/validations/home/testimonials.validation"

export const TestimonialsAdd: React.FC<any> = ({ addData, setAddData, refetch, currentLanguage }) => {
  const [activeTab, setActiveTab] = useState("az")
  const [profileImageState, setProfileImageState] = useState<{
    preview: string | null
    id: number | null
    error: string | null
    selectedFile: File | null
  }>({
    preview: null,
    id: null,
    error: null,
    selectedFile: null,
  })

  const [bankImageState, setBankImageState] = useState<{
    preview: string | null
    id: number | null
    error: string | null
    selectedFile: File | null
  }>({
    preview: null,
    id: null,
    error: null,
    selectedFile: null,
  })

  const [uploadImage, { isLoading: isUploading }] = useUploadFileMutation()
  const [addCustomers, { isLoading: addLoading }] = useAddCustomersMutation()

  const form = useForm<TestimonialFormValues & { profileAlt: string; bankAlt: string }>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      bank_name: "",
      translations: [
        { comment: "", lang: "az" },
        { comment: "", lang: "en" },
        { comment: "", lang: "ru" },
      ],
      customer_profile: -1,
      bank_logo: -1,
      profileAlt: "",
      bankAlt: "",
    },
  })

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationResult = validateImage(file, setProfileImageState, profileImageState)
    if (validationResult === false) {
      toast.error("Şəkil yüklənərkən xəta baş verdi")
      return
    }

    // Just store the file and show preview without uploading
    setProfileImageState({
      preview: URL.createObjectURL(file),
      id: null,
      error: null,
      selectedFile: file,
    })
  }

  const handleBankImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationResult = validateImage(file, setBankImageState, bankImageState)
    if (validationResult === false) {
      toast.error("Şəkil yüklənərkən xəta baş verdi")
      return
    }

    // Just store the file and show preview without uploading
    setBankImageState({
      preview: URL.createObjectURL(file),
      id: null,
      error: null,
      selectedFile: file,
    })
  }

  const uploadProfileImage = async () => {
    if (!profileImageState.selectedFile) {
      toast.error("Zəhmət olmasa əvvəlcə şəkil seçin")
      return
    }

    try {
      const formData = new FormData()
      formData.append("file", profileImageState.selectedFile)
      formData.append("alt", form.getValues("profileAlt") || "")

      const response = await uploadImage(formData).unwrap()

      setProfileImageState({
        preview: response.url,
        id: response.id,
        error: null,
        selectedFile: null,
      })

      form.setValue("customer_profile", response.id, { shouldValidate: true })
      toast.success("Profil şəkli uğurla yükləndi")
    } catch (error) {
      toast.error("Şəkil yüklənərkən xəta baş verdi")
    }
  }

  const uploadBankImage = async () => {
    if (!bankImageState.selectedFile) {
      toast.error("Zəhmət olmasa əvvəlcə şəkil seçin")
      return
    }

    try {
      const formData = new FormData()
      formData.append("file", bankImageState.selectedFile)
      formData.append("alt", form.getValues("bankAlt") || "")

      const response = await uploadImage(formData).unwrap()

      setBankImageState({
        preview: response.url,
        id: response.id,
        error: null,
        selectedFile: null,
      })

      form.setValue("bank_logo", response.id, { shouldValidate: true })
      toast.success("Şirkət logosu uğurla yükləndi")
    } catch (error) {
      toast.error("Şəkil yüklənərkən xəta baş verdi")
    }
  }

  const removeProfileImage = () => {
    if (profileImageState.preview && !profileImageState.id) {
      URL.revokeObjectURL(profileImageState.preview)
    }

    setProfileImageState({
      preview: null,
      id: null,
      error: null,
      selectedFile: null,
    })

    form.setValue("customer_profile", -1)
    form.setValue("profileAlt", "")
  }

  const removeBankImage = () => {
    if (bankImageState.preview && !bankImageState.id) {
      URL.revokeObjectURL(bankImageState.preview)
    }

    setBankImageState({
      preview: null,
      id: null,
      error: null,
      selectedFile: null,
    })

    form.setValue("bank_logo", -1)
    form.setValue("bankAlt", "")
  }

  const onSubmit = async (data: TestimonialFormValues & { profileAlt: string; bankAlt: string }) => {
    try {
      // Check if we have unuploaded images
      if (profileImageState.selectedFile && !profileImageState.id) {
        toast.error("Zəhmət olmasa əvvəlcə profil şəklini yükləyin")
        return
      }

      if (bankImageState.selectedFile && !bankImageState.id) {
        toast.error("Zəhmət olmasa əvvəlcə şirkət logosunu yükləyin")
        return
      }

      // Remove alt text fields before submitting to API
      const { profileAlt, bankAlt, ...submitData } = data

      await addCustomers(submitData).unwrap()
      toast.success("Rəy uğurla əlavə edildi!")
      await refetch()
      setAddData(false)
      form.reset()
      setProfileImageState({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
      })
      setBankImageState({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
      })
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
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customer_profile"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel htmlFor="customer_profile">Müştəri Profil Şəkli *</FormLabel>
                          <FormControl>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-40 relative">
                              {profileImageState.preview ? (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={profileImageState.preview || "/placeholder.svg"}
                                    alt={form.getValues("profileAlt") || "Customer profile preview"}
                                    fill
                                    className="object-contain rounded-full"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-0 right-0 bg-white rounded-full"
                                    onClick={removeProfileImage}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <input type="hidden" value={field.value || ""} onChange={field.onChange} />
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                  <p className="text-sm text-muted-foreground">
                                    Şəkil yükləmək üçün klikləyin və ya sürükləyin
                                  </p>
                                  <input
                                    id="customer_profile"
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleProfileImageChange}
                                  />
                                  <input type="hidden" value={field.value || ""} onChange={field.onChange} />
                                </>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Alt text for profile image */}
                    {profileImageState.preview && !profileImageState.id && (
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="profileAlt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profil Şəkli Təsviri (Alt text)</FormLabel>
                              <FormControl>
                                <Input placeholder="Şəkil haqqında təsvir yazın" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="button" onClick={uploadProfileImage} disabled={isUploading} className="w-full">
                          {isUploading ? (
                            <span className="flex items-center">
                              <Loader2 className="animate-spin h-4 w-4 mr-1" />
                              Yüklənir...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Upload className="h-4 w-4 mr-1" />
                              Profil şəklini yüklə
                            </span>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Bank Logo */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="bank_logo"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel htmlFor="bank_logo">Şirkət Logosu *</FormLabel>
                          <FormControl>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-40 relative">
                              {bankImageState.preview ? (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={bankImageState.preview || "/placeholder.svg"}
                                    alt={form.getValues("bankAlt") || "Bank logo preview"}
                                    fill
                                    className="object-contain"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-0 right-0 bg-white rounded-full"
                                    onClick={removeBankImage}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <input type="hidden" value={field.value || ""} onChange={field.onChange} />
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                  <p className="text-sm text-muted-foreground">
                                    Şəkil yükləmək üçün klikləyin və ya sürükləyin
                                  </p>
                                  <input
                                    id="bank_logo"
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleBankImageChange}
                                  />
                                  <input type="hidden" value={field.value || ""} onChange={field.onChange} />
                                </>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Alt text for bank logo */}
                    {bankImageState.preview && !bankImageState.id && (
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="bankAlt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logo Təsviri (Alt text)</FormLabel>
                              <FormControl>
                                <Input placeholder="Logo haqqında təsvir yazın" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="button" onClick={uploadBankImage} disabled={isUploading} className="w-full">
                          {isUploading ? (
                            <span className="flex items-center">
                              <Loader2 className="animate-spin h-4 w-4 mr-1" />
                              Yüklənir...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Upload className="h-4 w-4 mr-1" />
                              Logonu yüklə
                            </span>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
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
                              <Textarea placeholder="Rəy mətnini daxil edin..." rows={5} {...field} />
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
                              <Textarea placeholder="Enter testimonial text..." rows={5} {...field} />
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
                              <Textarea placeholder="Введите текст отзыва..." rows={5} {...field} />
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
                <Button type="submit">
                  {addLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin h-4 w-4 mr-1" />
                      Əlavə edilir...
                    </span>
                  ) : (
                    <span>Əlavə et</span>
                  )}
                </Button>
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
