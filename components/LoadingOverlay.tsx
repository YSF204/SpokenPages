"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
    isOpen: boolean
    title?: string
    description?: string
}

export function LoadingOverlay({
    isOpen,
    title,
    description,
}: LoadingOverlayProps) {
    if (!isOpen) {
        return null
    }

    return (
        <div className="loading-wrapper" role="status" aria-live="polite">
            <div className="loading-shadow-wrapper bg-white shadow-soft">
                <div className="loading-shadow">
                    <Loader2 className="loading-animation h-10 w-10 text-[#663820]" />
                    {title ? <p className="loading-title">{title}</p> : null}
                    {description ? (
                        <p className="text-sm text-[var(--text-secondary)]">
                            {description}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
