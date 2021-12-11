import { ReactNode, useEffect } from "react"
import { NextSeo } from "next-seo";
import { Container } from "@chakra-ui/react";

type LayoutProps = {
    children?: ReactNode,
    title?: string,
    description?: string,
    [rest: string]: any;
}

const Layout = ({ children, title = 'Next.js + Chakra UI', description, ...rest }: LayoutProps): JSX.Element => {
    useEffect(() => {
        console.log('Layout render!')
    }, [])

    return (
        <>
            <NextSeo title={title} description={description} openGraph={{ title, description }} />
            <Container
                {...rest}
            >
                {children}
            </Container>
        </>
    )
}

export default Layout
