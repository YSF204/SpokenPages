'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SignInButton, SignUpButton, Show, UserButton, useUser } from "@clerk/nextjs";

const navItems = [
    { label: "Library", href: "/" },
    { label: "Add New", href: "/books/new" }
]

const Navbar = () => {
    const pathName = usePathname()
    const { user } = useUser()

    return (
        <header className="w-full fixed z-50 bg-[var(--bg-primary)]">
            <div className="wrapper navbar-height py-4 flex justify-between items-center">

                {/* Logo */}
                <Link href="/" className="flex gap-0.5 items-center">
                    <Image
                        src="/assets/logo.png"
                        alt="bookify"
                        width={42}
                        height={26}
                    />
                    <span className="logo-text">SpokenPages</span>
                </Link>

                {/* Nav */}
                <nav className="w-fit flex gap-7.5 items-center">

                    {navItems.map(({ label, href }) => {
                        const isActive =
                            pathName === href ||
                            (href !== "/" && pathName.startsWith(href))

                        return (
                            <Link
                                key={label}
                                href={href}
                                className={cn(
                                    'nav-link-base',
                                    isActive
                                        ? 'nav-link-active'
                                        : 'text-black hover:opacity-70'
                                )}
                            >
                                {label}
                            </Link>
                        )
                    })}

                    {/* Auth */}
                    <div className="flex gap-7.5 items-center">
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className="nav-btn">Sign In</button>
                            </SignInButton>

                            <SignUpButton mode="modal">
                                <button className="btn-primary py-2 px-4 text-sm">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </Show>

                        <Show when="signed-in">
                            <div className="nav-user-link">
                                <UserButton />
                                {user?.firstName && (
                                    <Link href="/subscriptions" className="nav-user-name">
                                        {user.firstName}
                                    </Link>
                                )}
                            </div>
                        </Show>
                    </div>

                </nav>
            </div>
        </header>
    )
}

export default Navbar