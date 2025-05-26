import { CourseFormData } from "@/validations/study-area/course-add.validation";

export const courseDefaultValues: CourseFormData = {
    name: "",
    slug: "",
    color: "#DE465D",
    image: 1,
    translations: [
        { course_detail: "", lang: "az" },
        { course_detail: "", lang: "en" },
        { course_detail: "", lang: "ru" },
    ],
    faq: [
        { title: "", description: "", lang: "az" },
        { title: "", description: "", lang: "en" },
        { title: "", description: "", lang: "ru" },
    ],
    program: [
        {
            name: "",
            translations: [
                { description: "", lang: "az" },
                { description: "", lang: "en" },
                { description: "", lang: "ru" },
            ],
        },
    ],
    meta: [],
    group: [],
};
