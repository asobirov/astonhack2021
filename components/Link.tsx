import NextLink from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useRouter } from 'next/router'
import { MouseEventHandler } from 'react';

type LinkProps = {
    href: string
    children: any
    activeOnPath?: boolean //IDK,
    isExternal?: boolean
    onClick?: MouseEventHandler<HTMLAnchorElement>
    [rest: string]: any;
}

export const Link = ({ href = '#', activeOnPath = false, activeColor, activeVariant, isExternal, children, onClick, ...rest }: LinkProps): JSX.Element => {
    const router = useRouter()
    const isActive = router.pathname === href

    return (
        <NextLink href={href} passHref={true}>
            <ChakraLink
                className={activeOnPath && isActive ? 'active' : ''}
                isExternal={isExternal}
                onClick={onClick}
                {...rest}
            >
                {children}
            </ChakraLink>
        </NextLink>
    )
}