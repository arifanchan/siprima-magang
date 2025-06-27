/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

export default function AppLogo() {
    return (
        <>
            <img src="/kementan.svg" alt="Logo" className="size-8 rounded-md object-contain" />
            <div className="ml-1 grid flex-1 text-left">
                {/*<span style={{ fontFamily: 'BodoniFLF, serif', letterSpacing: '1px', color: '#cf9921' }} className="font-extrabold text-lg leading-tight">SIPRIMA</span>*/}
                {/*<span style={{ fontFamily: 'BodoniFLF, serif', color: '#cf9921' }} className="-mt-1 text-xs font-medium">M a g a n g</span>*/}
                <span style={{ fontFamily: 'BodoniFLF, serif', letterSpacing: '1px'  }} className="font-extrabold text-lg leading-tight">SIPRIMA</span>
                <span style={{ fontFamily: 'BodoniFLF, serif', }} className="-mt-1 text-xs font-medium">M a g a n g</span>
            </div>
        </>
    );
}
