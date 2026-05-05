"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Image as ImageIcon, Upload, X } from "lucide-react"
import { useForm, type ControllerRenderProps } from "react-hook-form"
import { z } from "zod"

import { LoadingOverlay } from "@/components/LoadingOverlay"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from "@/components/ui/form"
import {
    ACCEPTED_IMAGE_TYPES,
    ACCEPTED_PDF_TYPES,
    MAX_FILE_SIZE,
    voiceCategories,
    voiceOptions,
} from "@/lib/constants"
import { cn } from "@/lib/utils"

type VoiceKey = keyof typeof voiceOptions

const voiceNames = Object.values(voiceOptions).map((voice) => voice.name) as [
    string,
    ...string[]
]

const voiceOptionsByCategory = {
    male: voiceCategories.male.map((key) => voiceOptions[key as VoiceKey]),
    female: voiceCategories.female.map((key) => voiceOptions[key as VoiceKey]),
}

const formSchema = z.object({
    pdf: z
        .instanceof(File, { message: "PDF file is required." })
        .refine((file) => ACCEPTED_PDF_TYPES.includes(file.type), {
            message: "Only PDF files are allowed.",
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "PDF must be 50MB or smaller.",
        }),
    cover: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Cover image must be JPG, PNG, or WebP.",
        }),
    title: z.string().min(1, "Title is required."),
    author: z.string().min(1, "Author name is required."),
    voice: z.enum(voiceNames, { error: "Please choose a voice." }),
})

type FormValues = z.infer<typeof formSchema>

type VoiceOptionsProps = {
    field: ControllerRenderProps<FormValues, "voice">
}

const VoiceOptions = ({ field }: VoiceOptionsProps) => {
    const { formItemId } = useFormField()
    const makeInputId = (voiceName: string, index: number) => {
        const slug = voiceName.toLowerCase().replace(/\s+/g, "-")
        return index === 0 ? formItemId : `${formItemId}-${slug}`
    }

    const maleOptions = voiceOptionsByCategory.male
    const femaleOptions = voiceOptionsByCategory.female

    return (
        <div className="space-y-5">
            <div className="space-y-3">
                <p className="text-sm font-medium text-[#777]">Male Voices</p>
                <div className="voice-selector-options flex-col sm:flex-row">
                    {maleOptions.map((voice, index) => (
                        <label
                            key={voice.name}
                            className={cn(
                                "voice-selector-option",
                                field.value === voice.name
                                    ? "voice-selector-option-selected"
                                    : "voice-selector-option-default"
                            )}
                        >
                            <FormControl>
                                <input
                                    id={makeInputId(voice.name, index)}
                                    type="radio"
                                    name={field.name}
                                    value={voice.name}
                                    className="sr-only"
                                    checked={field.value === voice.name}
                                    onChange={() => field.onChange(voice.name)}
                                />
                            </FormControl>
                            <div className="text-left">
                                <p className="text-base font-semibold text-[#212a3b]">
                                    {voice.name}
                                </p>
                                <p className="text-sm text-[#777]">{voice.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
            <div className="space-y-3">
                <p className="text-sm font-medium text-[#777]">Female Voices</p>
                <div className="voice-selector-options flex-col sm:flex-row">
                    {femaleOptions.map((voice, index) => (
                        <label
                            key={voice.name}
                            className={cn(
                                "voice-selector-option",
                                field.value === voice.name
                                    ? "voice-selector-option-selected"
                                    : "voice-selector-option-default"
                            )}
                        >
                            <FormControl>
                                <input
                                    id={makeInputId(voice.name, index + maleOptions.length)}
                                    type="radio"
                                    name={field.name}
                                    value={voice.name}
                                    className="sr-only"
                                    checked={field.value === voice.name}
                                    onChange={() => field.onChange(voice.name)}
                                />
                            </FormControl>
                            <div className="text-left">
                                <p className="text-base font-semibold text-[#212a3b]">
                                    {voice.name}
                                </p>
                                <p className="text-sm text-[#777]">{voice.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function UploadForm() {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const pdfInputRef = React.useRef<HTMLInputElement | null>(null)
    const coverInputRef = React.useRef<HTMLInputElement | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            author: "",
        },
    })

    const handleSubmit = async (values: FormValues) => {
        setIsSubmitting(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1200))
            form.reset()
            if (pdfInputRef.current) {
                pdfInputRef.current.value = ""
            }
            if (coverInputRef.current) {
                coverInputRef.current.value = ""
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="new-book-wrapper space-y-8">
            <LoadingOverlay isOpen={isSubmitting} />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8"
                    noValidate
                >
                    <FormField
                        control={form.control}
                        name="pdf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Book PDF File</FormLabel>
                                <FormControl>
                                    <input
                                        ref={pdfInputRef}
                                        type="file"
                                        accept={ACCEPTED_PDF_TYPES.join(",")}
                                        className="hidden"
                                        onChange={(event) =>
                                            field.onChange(event.target.files?.[0] ?? undefined)
                                        }
                                    />
                                </FormControl>
                                <div
                                    className={cn(
                                        "upload-dropzone border-2 border-dashed border-[var(--border-subtle)]",
                                        field.value ? "upload-dropzone-uploaded" : ""
                                    )}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => pdfInputRef.current?.click()}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault()
                                            pdfInputRef.current?.click()
                                        }
                                    }}
                                >
                                    <Upload className="upload-dropzone-icon" />
                                    <p className="upload-dropzone-text">Click to upload PDF</p>
                                    <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
                                    {field.value ? (
                                        <div className="mt-4 flex items-center gap-2 text-sm text-[#663820]">
                                            <span className="truncate max-w-[220px] sm:max-w-[280px]">
                                                {field.value.name}
                                            </span>
                                            <button
                                                type="button"
                                                className="upload-dropzone-remove"
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    field.onChange(undefined)
                                                    if (pdfInputRef.current) {
                                                        pdfInputRef.current.value = ""
                                                    }
                                                }}
                                                aria-label="Remove PDF"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cover"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">
                                    Cover Image (Optional)
                                </FormLabel>
                                <FormControl>
                                    <input
                                        ref={coverInputRef}
                                        type="file"
                                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                        className="hidden"
                                        onChange={(event) =>
                                            field.onChange(event.target.files?.[0] ?? undefined)
                                        }
                                    />
                                </FormControl>
                                <div
                                    className={cn(
                                        "upload-dropzone border-2 border-dashed border-[var(--border-subtle)]",
                                        field.value ? "upload-dropzone-uploaded" : ""
                                    )}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => coverInputRef.current?.click()}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault()
                                            coverInputRef.current?.click()
                                        }
                                    }}
                                >
                                    <ImageIcon className="upload-dropzone-icon" />
                                    <p className="upload-dropzone-text">
                                        Click to upload cover image
                                    </p>
                                    <p className="upload-dropzone-hint">
                                        Leave empty to auto-generate from PDF
                                    </p>
                                    {field.value ? (
                                        <div className="mt-4 flex items-center gap-2 text-sm text-[#663820]">
                                            <span className="truncate max-w-[220px] sm:max-w-[280px]">
                                                {field.value.name}
                                            </span>
                                            <button
                                                type="button"
                                                className="upload-dropzone-remove"
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    field.onChange(undefined)
                                                    if (coverInputRef.current) {
                                                        coverInputRef.current.value = ""
                                                    }
                                                }}
                                                aria-label="Remove cover image"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Title</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        className="form-input"
                                        placeholder="ex: Rich Dad Poor Dad"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Author Name</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        className="form-input"
                                        placeholder="ex: Robert Kiyosaki"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="voice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">
                                    Choose Assistant Voice
                                </FormLabel>
                                <VoiceOptions field={field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <button type="submit" className="form-btn" disabled={isSubmitting}>
                        Begin Synthesis
                    </button>
                </form>
            </Form>
        </div>
    )
}

