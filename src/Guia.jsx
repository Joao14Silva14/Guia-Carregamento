import { useState, useEffect, useRef, useMemo } from "react";

/*
 * Goldenergy · Carregar em casa
 * Guia para programar o carregamento do carro elétrico nas horas de vazio, através da app de cada marca.
 * React 18 + Tailwind CSS. Componente autónomo: dados, guias e ilustrações incluídos neste ficheiro.
 *
 * Estrutura:
 *   1. Dados: marcas/modelos/versões (EV Database), fotografias, guias por app e temas visuais das apps
 *   2. Motor das ilustrações do telemóvel (39 estilos de app, CSS isolado em .gm)
 *   3. Interface React: passo 1 (carro), passo 2 (vazio), passo 3 (guia), dicas e fontes
 */

/* ===================== 1. Dados ===================== */
const RAW = `
@Abarth|stellantis|
#500e
1903 500e Hatchback
1904 500e Convertible
#600e
3056 600e Turismo
3514 600e Competizione
@Alfa Romeo|stellantis|
#Junior Elettrica
2184 Junior Elettrica 54 kWh
2185 Junior Elettrica 54 kWh Veloce
@Alpine|renault|My Alpine
#A290
2268 A290 Electric 180 hp
2269 A290 Electric 220 hp
#A390
3390 A390 GT
3391 A390 GTS
@Audi|vw|myAudi
#A2 e-tron
3725 A2 e-tron 125 kW - 50 kWh
3726 A2 e-tron 140 kW - 58 kWh
3727 A2 e-tron 170 kW - 79 kWh
3728 A2 e-tron 240 kW - 79 kWh
#A6 e-tron
3053 A6 Sportback e-tron
3052 A6 Sportback e-tron quattro
2270 A6 Sportback e-tron performance
3055 A6 Avant e-tron
3054 A6 Avant e-tron quattro
2272 A6 Avant e-tron performance
2271 S6 Sportback e-tron
2273 S6 Avant e-tron
#e-tron GT
3182 e-tron GT quattro
2219 S e-tron GT
2220 RS e-tron GT
2221 RS e-tron GT performance
#Q4 e-tron
3587 Q4 e-tron
3589 Q4 e-tron quattro
3590 Q4 e-tron quattro performance
3877 Q4 e-tron performance 77 kWh
3591 Q4 Sportback e-tron
3593 Q4 Sportback e-tron quattro
3594 Q4 Sportback e-tron quattro performance
3878 Q4 Sportback e-tron performance 77 kWh
#Q6 e-tron
3487 Q6 SUV e-tron quattro
2215 Q6 SUV e-tron performance
2147 SQ6 SUV e-tron
3041 Q6 Sportback e-tron
3042 Q6 Sportback e-tron performance
3488 Q6 Sportback e-tron quattro
3044 SQ6 Sportback e-tron
#e-tron / Q8 e-tron
- e-tron / Q8 e-tron (2019–2025)
@Bentley|generic|My Bentley
#Torcal
3817 Torcal
3818 Torcal S
@BMW|bmw|My BMW
#i3
3814 i3 40 xDrive
3657 i3 50 xDrive
- i3 / i3s (2013–2022)
#i4
3204 i4 eDrive35
3205 i4 eDrive40
3206 i4 xDrive40
3207 i4 M60 xDrive
#i5
3112 i5 eDrive40 Sedan
3113 i5 xDrive40 Sedan
3114 i5 M60 xDrive Sedan
3115 i5 eDrive40 Touring
3116 i5 xDrive40 Touring
3117 i5 M60 xDrive Touring
#i7
3556 i7 50 xDrive
3557 i7 60 xDrive
3558 i7 M70 xDrive
#iX
3109 iX xDrive45
3110 iX xDrive60
3111 iX M70 xDrive
#iX1
3458 iX1 eDrive20
3459 iX1 xDrive30
#iX2
3460 iX2 eDrive20
3461 iX2 xDrive30
#iX3
3505 iX3 40
3823 iX3 40 xDrive
3290 iX3 50 xDrive
- iX3 (2021–2024)
#iX4
3826 iX4 40 xDrive
3827 iX4 50 xDrive
#iX5
3664 iX5 60 xDrive
@BYD|byd|BYD
#ATTO 2
3494 ATTO 2 51.1 kWh
3268 ATTO 2 64.8 kWh
#ATTO 3
- ATTO 3
#DOLPHIN
3297 DOLPHIN 60.4 kWh
#DOLPHIN SURF
3193 DOLPHIN SURF 30 kWh Active
3195 DOLPHIN SURF 43.2 kWh Comfort
3194 DOLPHIN SURF 43.2 kWh Boost
#SEAL
3517 SEAL 61.4 kWh RWD Comfort
3515 SEAL 82.5 kWh RWD Design
3516 SEAL 82.5 kWh AWD Excellence
#SEAL U
2067 SEAL U 87 kWh Design
#SEALION 7
3070 SEALION 7 82.5 kWh RWD Comfort
3071 SEALION 7 82.5 kWh AWD Design
3072 SEALION 7 91.3 kWh AWD Excellence
#TANG
2095 TANG Flagship
#HAN
+HAN
#e6
-e6 (2019–2022)
#ETP3 (comercial)
+ETP3
@Cadillac|generic|
#LYRIQ
2243 LYRIQ 600 E4
3266 LYRIQ-V
#OPTIQ
3371 OPTIQ 500 E4
#VISTIQ
3267 VISTIQ 900 E4
@Changan|cn|
#Deepal S05
3367 Deepal S05 RWD
3368 Deepal S05 4WD Max
#Deepal S07
3369 Deepal S07 Standard
@Citroën|stellantis|MyCitroën
#ë-C3
3280 ë-C3 Urban Range 30 kWh
2039 ë-C3 Standard Range 44 kWh
#ë-C3 Aircross
2224 ë-C3 Aircross Comfort Range 44 kWh
3228 ë-C3 Aircross Extended Range 54 kWh
#ë-C4
3047 ë-C4
3048 ë-C4 54 kWh
#ë-C4 X
3049 ë-C4 X
3050 ë-C4 X 54 kWh
#ë-C5 Aircross
3230 C5 Aircross Comfort Range
3231 C5 Aircross Long Range
#ë-Berlingo
2159 ë-Berlingo M 50 kWh
2160 ë-Berlingo XL 50 kWh
#ë-Jumpy Combi
2303 ë-Jumpy Combi M 49 kWh
2304 ë-Jumpy Combi XL 49 kWh
2305 ë-Jumpy Combi M 75 kWh
2306 ë-Jumpy Combi XL 75 kWh
#ë-SpaceTourer
2252 ë-SpaceTourer M 49 kWh
2253 ë-SpaceTourer XL 49 kWh
2254 ë-SpaceTourer M 75 kWh
2255 ë-SpaceTourer XL 75 kWh
#Ami (quadriciclo) ~quad
+Ami
#C-Zero ~legacy
-C-Zero (2010–2020)
#ë-Méhari ~legacy
-ë-Méhari (2016–2019)
#ë-Berlingo Van (comercial)
+ë-Berlingo Van
#ë-Jumpy Van (comercial)
+ë-Jumpy Van
#ë-Jumper (comercial)
+ë-Jumper
@CUPRA|vw|CUPRA
#Born
3511 Born 140 kW - 58 kWh
3512 Born 170 kW - 79 kWh
3513 Born VZ
#Raval
3507 Raval 85 kW - 37 kWh
3508 Raval 99 kW - 37 kWh
3509 Raval 155 kW - 52 kWh
3510 Raval VZ
#Tavascan
3608 Tavascan 140 kW - 58 kWh
3609 Tavascan 210 kW - 77 kWh Endurance
3610 Tavascan 250 kW - 77 kWh VZ
@Dacia|dacia|My Dacia
#Spring
3408 Spring Electric 70
3729 Spring Electric 80
3409 Spring Electric 100
- Spring (2021–2023)
@Denza|cn|DENZA
#Z9GT
3730 Z9GT 122.49 kWh AWD
@Dongfeng|cn|
#Box
3035 Box 31.4 kWh
3036 Box 42.3 kWh
@DS Automobiles|stellantis|MyDS
#DS 3 E-Tense
1791 DS 3 E-Tense
#N°4
3200 N°4 E-Tense
#N°7
3624 N°7 FWD Long Range
3625 N°7 AWD Long Range
#N°8
3076 N°8 FWD
3077 N°8 FWD Long Range
3078 N°8 AWD Long Range
#DS 3 Crossback E-Tense
-DS 3 Crossback E-Tense (2019–2022)
@Elaris|generic|
#BEO
1975 BEO 86 kWh
@Ferrari|generic|
#Luce
3643 Luce
@Fiat|stellantis|FIAT
#500e
1285 500e Hatchback 42 kWh
1328 500e 3+1 42 kWh
1275 500e Cabrio 42 kWh
#600e
1945 600e
#Grande Panda
2251 Grande Panda 44 kWh
3866 Grande Panda 54 kWh
#E-Scudo Combi
2315 E-Scudo Combi L2 49 kWh
2316 E-Scudo Combi L3 49 kWh
2317 E-Scudo Combi L2 75 kWh
2318 E-Scudo Combi L3 75 kWh
#Topolino (quadriciclo) ~quad
+Topolino
#E-Doblò
+E-Doblò
#E-Ducato (comercial)
+E-Ducato
@firefly|nio|
#firefly
3178 firefly
@Ford|ford|Ford
#Capri
3647 Capri Standard Range RWD
3648 Capri Extended Range RWD
3649 Capri Extended Range AWD
#Explorer
3644 Explorer Standard Range RWD
3645 Explorer Extended Range RWD
3646 Explorer Extended Range AWD
#Mustang Mach-E
3188 Mustang Mach-E ER RWD
3189 Mustang Mach-E ER AWD
3190 Mustang Mach-E GT
3191 Mustang Mach-E Rally
#Puma Gen-E
3597 Puma Gen-E
#e-Tourneo Courier
3846 e-Tourneo Courier
#e-Tourneo Custom
3420 e-Tourneo Custom L1 160 kW RWD
3421 e-Tourneo Custom L1 160 kW AWD
3422 e-Tourneo Custom L1 210 kW RWD
3423 e-Tourneo Custom L1 210 kW AWD
3424 e-Tourneo Custom L2 160 kW RWD
3425 e-Tourneo Custom L2 160 kW AWD
3426 e-Tourneo Custom L2 210 kW RWD
3427 e-Tourneo Custom L2 210 kW AWD
#e-Transit Custom Kombi
3690 e-Transit Custom Kombi L1 100 kW 71 kWh
3691 e-Transit Custom Kombi L1 160 kW 71 kWh
3860 e-Transit Custom Kombi L1 160 kW 71 kWh AWD
3692 e-Transit Custom Kombi L2 100 kW 71 kWh
3693 e-Transit Custom Kombi L2 160 kW 71 kWh
3861 e-Transit Custom Kombi L2 160 kW 71 kWh AWD
#E-Transit (comercial)
+E-Transit
#E-Transit Courier (comercial)
+E-Transit Courier
#Focus Electric ~legacy
-Focus Electric (2013–2018)
@GAC|cn|
#AION UT
3518 AION UT 60 kWh
#AION V
3559 AION V 75 kWh
#AION Y Plus
+AION Y Plus
@Geely|cn|
#E2
3700 E2 35 kWh
3701 E2 47 kWh
#E5
3308 E5 Pro
3582 E5 Pro+
3583 E5 Max+
@Genesis|hk|
#G80
3238 G80 Electrified
#GV60
3234 GV60 Pure
3235 GV60 Sport
3236 GV60 Performance
3683 GV60 Magma
#GV70
3237 GV70 Electrified
@GWM|cn|My GWM
#ORA 07
2245 ORA 07 Pure
2246 ORA 07 Pro
2247 ORA 07 GT
#ORA 03 (Funky Cat)
+ORA 03 / Funky Cat
@Honda|honda|My Honda+
#Super-N
3656 Super-N
#e
- Honda e (2020–2024)
#e:Ny1
+e:Ny1
@Hyundai|hk|myHyundai
#INSTER
2230 INSTER Standard Range
2231 INSTER Long Range
#IONIQ 3
3554 IONIQ 3 42.2 kWh
3555 IONIQ 3 61 kWh
#IONIQ 5
2235 IONIQ 5 63 kWh RWD
2236 IONIQ 5 84 kWh RWD
2237 IONIQ 5 84 kWh AWD
2044 IONIQ 5 N
#IONIQ 6
3438 IONIQ 6 63 kWh RWD
3439 IONIQ 6 84 kWh RWD
3440 IONIQ 6 84 kWh AWD
3449 IONIQ 6 N
#IONIQ 9
3067 IONIQ 9 Long Range RWD
3068 IONIQ 9 Long Range AWD
3069 IONIQ 9 Performance AWD
#Kona Electric
3462 Kona Electric 48.6 kWh
3463 Kona Electric 64.8 kWh
1830 Kona Electric 65 kWh
- Kona Electric (2018–2023)
#STARIA Electric
3724 STARIA Electric 84 kWh
#IONIQ Electric
- IONIQ Electric (2016–2022)
@JAC|cn|
#E30X
3640 E30X 41 kWh
3641 E30X 51.5 kWh
@Jaecoo|cn|
#5 EV
3336 5 EV
@Jaguar|jlr|Jaguar Remote
#I-PACE
- I-PACE (2018–2024)
@Jeep|stellantis|Jeep
#Avenger
3723 Avenger Electric
#Compass Electric
3684 Compass Electric 74 kWh
3661 Compass Electric Long Range
3662 Compass Electric 4xe
@KGM|generic|
#Torres EVX
2189 Torres EVX
3389 Torres EVX 80.6 kWh
#Korando e-Motion
+Korando e-Motion (antiga SsangYong)
@Kia|hk|Kia
#EV2
3490 EV2 42.2 kWh
3491 EV2 61 kWh
#EV3
3637 EV3 Standard Range
3638 EV3 Long Range
3639 EV3 Long Range AWD
3663 EV3 GT
#EV4
3121 EV4 Fastback 58.3 kWh
3122 EV4 Fastback 81.4 kWh
3668 EV4 Hatchback 58.3 kWh
3669 EV4 Hatchback 81.4 kWh
3667 EV4 Hatchback 81.4 kWh AWD
3672 EV4 Hatchback 81.4 kWh GT
#EV5
3824 EV5 60.3 kWh
3300 EV5 81.4 kWh
3489 EV5 81.4 kWh AWD
3651 EV5 81.4 kWh GT
#EV6
3030 EV6 Standard Range 2WD
3028 EV6 Long Range 2WD
3029 EV6 Long Range AWD
3079 EV6 GT
#EV9
1833 EV9 76.1 kWh RWD
1834 EV9 99.8 kWh RWD
1835 EV9 99.8 kWh AWD
1993 EV9 99.8 kWh AWD GT-Line
3196 EV9 99.8 kWh AWD GT
#PV5 Passenger
3288 PV5 Passenger 51.5 kWh
3670 PV5 Passenger 51.5 kWh - 7 Seats
3289 PV5 Passenger 71.2 kWh
3671 PV5 Passenger 71.2 kWh - 7 Seats
#e-Niro / Niro EV
- e-Niro / Niro EV
#e-Soul
- e-Soul
#Soul EV ~legacy
-Soul EV (2014–2019)
@Lancia|stellantis|
#Gamma
3844 Gamma 97 kWh
3845 Gamma 97 kWh HF Integrale
#Ypsilon
3224 Ypsilon 54 kWh
3225 Ypsilon 54 kWh HF
@Land Rover|jlr|Land Rover Remote
#Range Rover
3716 Range Rover EV450
3717 Range Rover EV550
3718 Range Rover LWB EV550
#Range Rover Sport
3815 Range Rover Sport EV450
3816 Range Rover Sport EV550
@Leapmotor|cn|Leapmotor
#B03X
3665 B03X 39.8 kWh
3666 B03X 53.0 kWh
#B05
3563 B05 56.2 kWh
3564 B05 67.1 kWh
#B10
3870 B10 60.8 kWh
3233 B10 67.1 kWh
3869 B10 68.7 kWh
#C10
3040 C10 RWD 69.9 kWh
3387 C10 RWD 81.9 kWh
3388 C10 AWD 81.9 kWh
#T03
3039 T03
@Lexus|toyota|Lexus Link+
#ES
3493 ES 500e DIRECT 4
#RZ
3294 RZ 500e
3295 RZ 550e F SPORT
#TZ
3819 TZ 450e Standard Range
3820 TZ 450e Long Range
3821 TZ 550e Long Range
#UX 300e
- UX 300e
@Lotus|generic|Lotus Cars
#Eletre
3216 Eletre 600
3217 Eletre 900
#Emeya
3214 Emeya 600
3215 Emeya 900
@Lucid|generic|Lucid
#Air
3271 Air Pure RWD
3272 Air Touring
3273 Air Grand Touring
3274 Air Sapphire
#Gravity
3291 Gravity Touring
3292 Gravity Grand Touring
@Lynk&Co|cn|Lynk & Co
#02
3045 02
@Maserati|generic|Maserati Connect
#GranTurismo Folgore
3719 GranTurismo Folgore
#GranCabrio Folgore
3720 GranCabrio Folgore
#Grecale Folgore
3721 Grecale Folgore
@Maxus|generic|
#MIFA 7
2292 MIFA 7 77 kWh
2293 MIFA 7 90 kWh
#MIFA 9
1837 MIFA 9
#eDeliver 3 (comercial)
+eDeliver 3
#eDeliver 5 (comercial)
+eDeliver 5
#eDeliver 7 (comercial)
+eDeliver 7
#eDeliver 9 (comercial)
+eDeliver 9
#eT90 (pick-up)
+eT90
@Mazda|mazda|MyMazda
#6e
3713 6e 78 kWh
#CX-6e
3596 CX-6e 78 kWh
#MX-30
- MX-30
@Mercedes-Benz|mercedes|Mercedes-Benz
#CLA
3370 CLA 200
3473 CLA 250
3139 CLA 250+
3140 CLA 350 4MATIC
3711 CLA AMG 45 4MATIC+
#CLA Shooting Brake
3628 CLA Shooting Brake 200
3688 CLA Shooting Brake 250
3396 CLA Shooting Brake 250+
3397 CLA Shooting Brake 350 4MATIC
3712 CLA Shooting Brake AMG 45 4MATIC+
#Classe C
3785 C 300 4MATIC
3551 C 400 4MATIC
#GLA
3685 GLA 200
3686 GLA 250+
3687 GLA 350 4MATIC
#GLB
3788 GLB 200
3789 GLB 250
3406 GLB 250+
3407 GLB 350 4MATIC
#GLC
3653 GLC 250
3654 GLC 300 4MATIC
3296 GLC 400 4MATIC
#EQS
3577 EQS 400
3578 EQS 450+
3579 EQS 500 4MATIC
3580 EQS 580 4MATIC
#Classe G
2192 G 580
#AMG GT
3702 AMG GT 4-Door Coupé 53 4MATIC+
3627 AMG GT 4-Door Coupé 55 4MATIC+
3626 AMG GT 4-Door Coupé 63 4MATIC+
3852 AMG GT SUV 53 4MATIC+
#VLE
3519 VLE 300
3739 VLE 400 4MATIC
#eVito Tourer
2138 eVito Tourer Long 60 kWh
2139 eVito Tourer Extra-Long 60 kWh
2140 eVito Tourer Long 90 kWh
2294 eVito Tourer Extra-Long 90 kWh
#EQA
- EQA
#EQB
- EQB
#EQC
- EQC
#EQE / EQE SUV
- EQE / EQE SUV
#EQS SUV
- EQS SUV
#B 250 e ~legacy
-B 250 e (2014–2018)
#EQV
+EQV
#EQT
+EQT
#eCitan (comercial)
+eCitan
#eVito Van (comercial)
+eVito Van
#eSprinter (comercial)
+eSprinter
@MG|mg|MG iSMART
#MG4
3470 MG4 Urban Standard Range
3471 MG4 Urban Comfort Long Range
3472 MG4 Urban Premium Long Range
3467 MG4 Premium Long Range
3468 MG4 Premium Extended Range
3469 MG4 XPOWER
#MGS5 EV
3146 MGS5 EV 49 kWh
3147 MGS5 EV 64 kWh
#IM5
3245 IM5 Long Range
3246 IM5 Performance
#IM6
3247 IM6 Long Range
3248 IM6 Performance
#Cyberster
2202 Cyberster Trophy
#ZS EV
- ZS EV
#MG5
- MG5
#Marvel R
-Marvel R (2021–2023)
@Mini|bmw|MINI
#Cooper
1997 Cooper E
1998 Cooper SE
3058 Cooper JCW
- Cooper SE (2020–2023)
#Aceman
2190 Aceman E
2191 Aceman SE
3059 Aceman JCW
#Countryman
3456 Countryman E
3457 Countryman SE ALL4
@Mitsubishi|generic|
#Eclipse Cross
3856 Eclipse Cross 67 kWh
3335 Eclipse Cross 87 kWh
3857 Eclipse Cross 89 kWh
#i-MiEV ~legacy
-i-MiEV (2010–2020)
@NIO|nio|NIO
#EL6
1921 EL6 Standard Range
1922 EL6 Long Range
#EL8
2222 EL8 Standard Range
2223 EL8 Long Range
#ET5
1786 ET5 Standard Range
1787 ET5 Long Range
1916 ET5 Touring Long Range
#ET7
+ET7
#EL7
+EL7
@Nissan|nissan|MyNISSAN
#Ariya
3689 Ariya 63kWh
3681 Ariya 87kWh
3682 Ariya e-4ORCE 87kWh - 225 kW
#LEAF
3365 LEAF Standard Range 52 kWh
3366 LEAF Extended Range 75 kWh
- LEAF (2018–2025)
-LEAF 1.ª geração (2011–2017)
#Micra
3202 Micra Standard Range 40 kWh
3203 Micra Extended Range 52 kWh
#Pixo
3784 Pixo 27.5 kWh
#Townstar EV
2042 Townstar EV Passenger
3084 Townstar EV Passenger L2
#e-NV200
-e-NV200 / e-NV200 Evalia (2014–2022)
#Interstar-e (comercial)
+Interstar-e
@Omoda|cn|
#E5
3046 E5
@Opel|stellantis|MyOpel
#Astra Electric
3450 Astra Electric 58 kWh
3451 Astra Sports Tourer Electric 58 kWh
#Combo Electric
2161 Combo Electric 50 kWh
2162 Combo Electric XL 50 kWh
#Corsa Electric
3220 Corsa Electric 50 kWh
3221 Corsa Electric 54 kWh
3722 Corsa Electric GSE
#Frontera Electric
2238 Frontera Electric 44 kWh
3229 Frontera Electric 54 kWh
#Grandland Electric
3037 Grandland Electric 73 kWh
3201 Grandland Electric 73 kWh AWD
3364 Grandland Electric 97 kWh
#Mokka Electric
3051 Mokka Electric
3307 Mokka Electric GSE
#Vivaro Combi Electric
2311 Vivaro Combi Electric 49 kWh
2312 Vivaro Combi Electric XL 49 kWh
2313 Vivaro Combi Electric 75 kWh
2314 Vivaro Combi Electric XL 75 kWh
#Zafira Electric
2260 Zafira Electric 49 kWh
2261 Zafira Electric XL 49 kWh
2262 Zafira Electric 75 kWh
2263 Zafira Electric XL 75 kWh
#Ampera-e ~generic
-Ampera-e (2017–2020)
#Rocks Electric (quadriciclo) ~quad
+Rocks Electric
#Vivaro Electric (comercial)
+Vivaro Electric
#Movano Electric (comercial)
+Movano Electric
@Peugeot|stellantis|MyPeugeot
#e-208
3222 e-208 50 kWh
3223 e-208 54 kWh
3655 e-208 GTi
#e-2008
1947 e-2008 54 kWh
#e-308
3321 e-308 58 kWh
3322 e-308 SW 58 kWh
#e-3008
2004 e-3008 73 kWh Dual Motor
2005 e-3008 97 kWh Long Range
- e-3008 73 kWh (tração dianteira)
#e-408
3465 e-408 58 kWh
#e-5008
2149 e-5008 73 kWh
2150 e-5008 73 kWh Dual Motor
2151 e-5008 97 kWh Long Range
#e-Rifter
2163 e-Rifter M 50 kWh
2164 e-Rifter XL 50 kWh
#e-Expert Combi
2307 e-Expert Combi L2 49 kWh
2308 e-Expert Combi L3 49 kWh
2309 e-Expert Combi L2 75 kWh
2310 e-Expert Combi L3 75 kWh
#e-Traveller
2256 e-Traveller L2 49 kWh
2257 e-Traveller L3 49 kWh
2258 e-Traveller L2 75 kWh
2259 e-Traveller L3 75 kWh
#iOn ~legacy
-iOn (2011–2020)
#e-Partner (comercial)
+e-Partner
#e-Expert Van (comercial)
+e-Expert Van
#e-Boxer (comercial)
+e-Boxer
@Polestar|polestar|Polestar
#2
3150 2 Standard Range Single Motor
3151 2 Long Range Single Motor
3152 2 Long Range Dual Motor
3153 2 Long Range Performance
#3
3326 3 Rear Motor
3327 3 Dual Motor
3328 3 Performance
#4
3606 4 Coupé Rear Motor
3607 4 Coupé Dual Motor
3714 4 SUV Rear Motor
3715 4 SUV Dual Motor
#5
3298 5 Dual Motor
3299 5 Performance
@Porsche|porsche|My Porsche
#Cayenne Electric
3398 Cayenne Electric
3486 Cayenne S Electric
3399 Cayenne Turbo Electric
3560 Cayenne Coupé Electric
3561 Cayenne S Coupé Electric
3562 Cayenne Turbo Coupé Electric
#Macan Electric
3703 Macan Electric
3704 Macan 4 Electric
3705 Macan 4S Electric
3706 Macan GTS Electric
3707 Macan Turbo Electric
#Taycan
2098 Taycan
3060 Taycan 4
2100 Taycan 4S
2099 Taycan Plus
3061 Taycan 4 Plus
2101 Taycan 4S Plus
3062 Taycan GTS
2102 Taycan Turbo
2103 Taycan Turbo S
2144 Taycan Turbo GT
2145 Taycan Turbo GT Weissach
#Taycan Sport Turismo
2104 Taycan Sport Turismo
2105 Taycan Plus Sport Turismo
2106 Taycan 4S Sport Turismo
2107 Taycan 4S Plus Sport Turismo
3063 Taycan GTS Sport Turismo
2108 Taycan Turbo Sport Turismo
2109 Taycan Turbo S Sport Turismo
#Taycan Cross Turismo
2110 Taycan 4 Cross Turismo
2111 Taycan 4S Cross Turismo
2112 Taycan Turbo Cross Turismo
2113 Taycan Turbo S Cross Turismo
@Renault|renault|My Renault
#4 E-Tech
3855 4 E-Tech 37kWh 110hp
3853 4 E-Tech 40kWh 120hp
3854 4 E-Tech 52kWh 150hp ~ autonomia real ≈320 km
3127 4 E-Tech 52kWh 150hp ~ autonomia real ≈315 km
#5 E-Tech
3708 5 E-Tech 37kWh 110hp
2133 5 E-Tech 40kWh 95hp
3709 5 E-Tech 40kWh 120hp
3710 5 E-Tech 52kWh 150hp
#Megane E-Tech
3783 Megane E-Tech 67 kWh 220hp
- Megane E-Tech 60 kWh
#Scenic E-Tech
3786 Scenic E-Tech 67 kWh 220hp
3787 Scenic E-Tech 89 kWh 220hp
- Scenic E-Tech 87 kWh 170hp
#Twingo E-Tech
3392 Twingo E-Tech 27.5 kWh
- Twingo Electric (2020–2024)
#Kangoo E-Tech
1802 Kangoo E-Tech Electric
2043 Kangoo Grand E-Tech Electric
#ZOE
- ZOE (2013–2024)
#Twizy (quadriciclo) ~quad
-Twizy (2012–2023)
#Fluence Z.E. ~legacy
-Fluence Z.E. (2011–2014)
#Kangoo Z.E. ~legacy
-Kangoo Z.E. (2011–2021)
#Trafic E-Tech (comercial)
+Trafic E-Tech
#Master E-Tech (comercial)
+Master E-Tech
@Rolls-Royce|generic|
#Spectre
3650 Spectre Series II
@Škoda|vw|MyŠkoda
#Elroq
3565 Elroq 60
3566 Elroq 85
3867 Elroq 85 84 kWh
3567 Elroq 85x
3568 Elroq RS
#Enyaq
3569 Enyaq 60
3570 Enyaq 85
3868 Enyaq 85 84 kWh
3571 Enyaq 85x
3572 Enyaq RS
- Enyaq iV (2021–2024)
#Enyaq Coupe
3573 Enyaq Coupe 60
3574 Enyaq Coupe 85
3575 Enyaq Coupe 85x
3576 Enyaq Coupe RS
#Epiq
3620 Epiq 35
3621 Epiq 40
3622 Epiq 55
#Peaq
3658 Peaq 60
3659 Peaq 90
3660 Peaq 90x
#Citigo e iV ~legacy
-Citigo e iV (2019–2020)
@Smart|smart|smart
#1
2217 #1 Pure
2041 #1 Pro
1667 #1 Pro+
2053 #1 Premium
1748 #1 Brabus
#2
3838 #2 35.8 kWh
#3
2052 #3 Pro
1999 #3 Pro+
2054 #3 Premium
2000 #3 Brabus
#5
3141 #5 Pro
3142 #5 Pro+
3143 #5 Premium
3144 #5 Pulse
3699 #5 Premium AWD
3179 #5 Brabus
#EQ fortwo / forfour
- EQ fortwo / forfour (2017–2024)
#fortwo electric drive ~legacy
-fortwo electric drive (2012–2016)
@Subaru|generic|
#E-Outback
3506 E-Outback AWD
#Solterra
1567 Solterra AWD
3434 Solterra AWD 73.1 kWh
#Uncharted
3435 Uncharted 57.7 kWh
3436 Uncharted 77 kWh
3437 Uncharted 77 kWh AWD
@Suzuki|generic|
#e VITARA
3211 e VITARA 49 kWh 2WD
3212 e VITARA 61 kWh 2WD
3213 e VITARA 61 kWh 4WD AllGrip
@Tesla|tesla|Tesla
#Model 3
3403 Model 3 RWD ~ autonomia real ≈450 km
3740 Model 3 RWD ~ autonomia real ≈460 km
3404 Model 3 Premium RWD
3842 Model 3 Premium AWD
3841 Model 3 Performance
- Model 3 (2019–2023)
#Model Y
3741 Model Y RWD
3595 Model Y Premium RWD
3843 Model Y Premium AWD
3269 Model Y Performance
- Model Y (2021–2024)
#Model S
- Model S
#Model X
- Model X
@TOGG|generic|Trumore
#T10F
3304 T10F Standard Range RWD
3305 T10F Long Range RWD
3306 T10F Long Range AWD
#T10X
3301 T10X Standard Range RWD
3302 T10X Long Range RWD
3303 T10X Long Range AWD
@Toyota|toyota|MyToyota
#bZ4X
3133 bZ4X FWD 57.7 kWh
3134 bZ4X FWD 73.1 kWh
3135 bZ4X AWD 73.1 kWh
3400 bZ4X Touring FWD 74.7 kWh
3401 bZ4X Touring AWD 74.7 kWh
#C-HR+
3393 C-HR+ 57.7 kWh
3394 C-HR+ 77 kWh
#Urban Cruiser
3208 Urban Cruiser 48.8 kWh
3209 Urban Cruiser 61.1 kWh
3210 Urban Cruiser 61.1 kWh AWD
#Proace City Verso
2165 Proace City Verso L1 50 kWh
2166 Proace City Verso L2 50 kWh
#Proace Verso
2264 Proace Verso M 49 kWh
2266 Proace Verso M 75 kWh
2267 Proace Verso L 75 kWh
#Proace City Electric (comercial)
+Proace City Electric
#Proace Electric (comercial)
+Proace Electric
#Proace Max Electric (comercial)
+Proace Max Electric
@VinFast|generic|VinFast
#VF 6
3281 VF 6 Eco
3282 VF 6 Plus
#VF 8
1807 VF 8 Eco Extended Range
1809 VF 8 Plus Extended Range
@Volkswagen|volkswagen|Volkswagen
#ID.3
3520 ID.3 Neo 125 kW - 50 kWh
3521 ID.3 Neo 140 kW - 58 kWh
3522 ID.3 Neo 170 kW - 79 kWh
- ID.3 (2020–2023)
#ID.4
3495 ID.4 Pure
3496 ID.4 Pro
3875 ID.4 Pro 77 kWh
3497 ID.4 Pro 4MOTION
3498 ID.4 GTX
- ID.4 (2021–2024)
#ID.5
3499 ID.5 Pure
3500 ID.5 Pro
3502 ID.5 GTX
#ID.7
3598 ID.7 59 kWh
3599 ID.7 77 kWh
3600 ID.7 86 kWh
3601 ID.7 GTX
#ID.7 Tourer
3602 ID.7 Tourer 59 kWh
3603 ID.7 Tourer 77 kWh
3604 ID.7 Tourer 86 kWh
3605 ID.7 Tourer GTX
#ID. Polo
3674 ID. Polo 85 kW - 37 kWh
3675 ID. Polo 99 kW - 37 kWh
3581 ID. Polo 155 kW - 52 kWh
3825 ID. Polo GTI
#ID. Cross
3847 ID. Cross 85 kW - 37 kWh
3848 ID. Cross 99 kW - 37 kWh
3673 ID. Cross 155 kW - 52 kWh
#ID. Tiguan
3830 ID. Tiguan Pure
3831 ID. Tiguan Pro
3832 ID. Tiguan Pro 4MOTION
#ID. Buzz
3630 ID. Buzz NWB Pure
3631 ID. Buzz NWB Pro
3632 ID. Buzz NWB Pro 4MOTION
3633 ID. Buzz NWB GTX
3634 ID. Buzz LWB Pro
3635 ID. Buzz LWB Pro 4MOTION
3636 ID. Buzz LWB GTX
#e-Transporter Kombi
3790 e-Transporter Kombi L1 100 kW 71 kWh
3791 e-Transporter Kombi L1 160 kW 71 kWh
3792 e-Transporter Kombi L1 210 kW 71 kWh
3793 e-Transporter Kombi L2 100 kW 71 kWh
3794 e-Transporter Kombi L2 160 kW 71 kWh
3795 e-Transporter Kombi L2 210 kW 71 kWh
3796 e-Transporter Kombi L1 100 kW 4MOTION 71 kWh
3797 e-Transporter Kombi L1 160 kW 4MOTION 71 kWh
3798 e-Transporter Kombi L1 210 kW 4MOTION 71 kWh
3799 e-Transporter Kombi L2 100 kW 4MOTION 71 kWh
3800 e-Transporter Kombi L2 160 kW 4MOTION 71 kWh
3801 e-Transporter Kombi L2 210 kW 4MOTION 71 kWh
#e-Caravelle
3802 e-Caravelle L1 100 kW 71 kWh
3803 e-Caravelle L1 160 kW 71 kWh
3804 e-Caravelle L1 210 kW 71 kWh
3805 e-Caravelle L2 100 kW 71 kWh
3806 e-Caravelle L2 160 kW 71 kWh
3807 e-Caravelle L2 210 kW 71 kWh
3808 e-Caravelle L1 100 kW 4MOTION 71 kWh
3809 e-Caravelle L1 160 kW 4MOTION 71 kWh
3810 e-Caravelle L1 210 kW 4MOTION 71 kWh
3811 e-Caravelle L2 100 kW 4MOTION 71 kWh
3812 e-Caravelle L2 160 kW 4MOTION 71 kWh
3813 e-Caravelle L2 210 kW 4MOTION 71 kWh
#e-Golf
- e-Golf
#e-up!
- e-up!
#ID. Buzz Cargo (comercial)
+ID. Buzz Cargo
#e-Crafter (comercial)
+e-Crafter
@Volvo|volvo|Volvo Cars
#EX30
3477 EX30 P3
3478 EX30 P5
3479 EX30 P3 Long Range
3480 EX30 P5 Long Range
3481 EX30 P8 AWD
3482 EX30 Cross Country P5 Long Range
3483 EX30 Cross Country P8 AWD
#EX40 (antigo XC40 Recharge)
3731 EX40 P5
3732 EX40 P5 Long Range
3733 EX40 P8 AWD
3734 EX40 P8 Performance AWD
#EC40 (antigo C40 Recharge)
3735 EC40 P5
3736 EC40 P5 Long Range
3737 EC40 P8 AWD
3738 EC40 P8 Performance AWD
#EX60
3441 EX60 P6
3442 EX60 P10 AWD
3444 EX60 Cross Country P10 AWD
3443 EX60 P12 AWD
#EX90
3323 EX90 Single Motor
3324 EX90 Twin Motor
3325 EX90 Twin Motor Performance
#ES90
3128 ES90 Single Motor
3129 ES90 Twin Motor
3130 ES90 Twin Motor Performance
@Voyah|cn|
#Courage
3136 Courage 80 kWh RWD
3137 Courage 80 kWh AWD
#Dream
3629 Dream 108 kWh
#Free
2049 Free 106 kWh
@XPENG|xpeng|XPENG
#G6
3402 G6 RWD Standard Range
3275 G6 RWD Long Range
3276 G6 AWD Performance
#G9
3277 G9 RWD Standard Range
3278 G9 RWD Long Range
3279 G9 AWD Performance
#G9L
3839 G9L RWD Long Range
3840 G9L AWD Performance
#L03
3676 L03 RWD Standard Range
3677 L03 RWD Long Range
3678 L03 AWD Performance
#P7+
3431 P7+ RWD Standard Range
3432 P7+ RWD Long Range
3433 P7+ AWD Performance
#X9
3611 X9 FWD Standard Range
3612 X9 FWD Long Range
3613 X9 AWD Performance
#P7
-P7 (2022–2024)
#G3
-G3 (2020–2022)
@Zeekr|cn|ZEEKR
#001
1933 001 Long Range RWD
1934 001 Performance AWD
1935 001 Privilege AWD
#7GT
3428 7GT Core RWD
3429 7GT Long Range RWD
3430 7GT Privilege AWD
#7X
3082 7X Long Range RWD
3083 7X Privilege AWD
#X
3584 X Core RWD
3585 X Long Range RWD
3586 X Privilege AWD
@Aiways|cn|Aiways
#U5
+U5
#U6
+U6
@e.GO Mobile|legacy|
#Life
-e.GO Life
@Fisker|generic|Fisker
#Ocean
-Ocean ~ marca insolvente em 2024: a app pode já não funcionar
@Forthing|cn|
#Friday
+Friday EV
@Hongqi|cn|
#E-HS9
+E-HS9
#EH7
+EH7
#EHS7
+EHS7
@Seres|cn|
#3
+Seres 3
#5
+Seres 5
@Skywell|cn|
#ET5
+ET5
@Farizon|cn|
#SuperVAN (comercial)
+SuperVAN
@SEAT|vw|My SEAT
#Mii electric
-Mii electric (2019–2021)
@Iveco|generic|
#eDaily (comercial)
+eDaily
@Microlino|quad|
#Microlino (quadriciclo)
+Microlino
@Silence|quad|
#S04 Nanocar (quadriciclo)
+S04 Nanocar
@Mobilize|quad|
#Duo (quadriciclo)
+Duo
#Bento (quadriciclo comercial)
+Bento
@Aixam|quad|
#e-City / e-Coupé (quadriciclo)
+e-City
+e-Coupé
@Ligier|quad|
#Myli (quadriciclo)
+Myli
@XEV|quad|
#YoYo (quadriciclo)
+YoYo
@Bolloré|legacy|
#Bluecar
-Bluecar (2011–2018)
@Cenntro|generic|
#Logistar (comercial)
+Logistar
@Estrima|quad|
#Birò (quadriciclo)
+Birò
@Goupil|generic|
#G4 (comercial)
+G4
#G6 (comercial)
+G6
@Tazzari|legacy|
#Zero
-Zero / EM1
@Think|legacy|
#City
-City (2008–2012)
`;
const LOGO = "data:image/webp;base64,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";

const OK="ok", IND="ind";
/* Capturas reais (opcional). Coloquem os ficheiros num servidor Goldenergy e indiquem a pasta em base.
   Nome do ficheiro: {guia}-{n}.webp (ex.: bmw-1.webp) ou, para uma marca específica, {marca}-{guia}-{n}.webp (ex.: opel-stellantis-2.webp).
   Só são usados os ficheiros listados em files. Se um ficheiro falhar, aparece a ilustração. */
const SHOTS={base:"",files:[]};
/* Temas visuais inspirados nas apps (cores aproximadas, sem logótipos oficiais dentro das ilustrações).
   hd/hdfg = cor da barra superior nas apps com cabeçalho colorido */
const THEMES={
  tesla:{dark:1,bg:"#000000",card:"#1C1C1E",fg:"#FFFFFF",mut:"#8E8E93",line:"#2C2C2E",acc:"#3E6AE1",on:"#FFFFFF",name:"Tesla"},
  bmw:{dark:1,bg:"#0B0E14",card:"#1A1F29",fg:"#FFFFFF",mut:"#8D96A5",line:"#262D3A",acc:"#1C69D4",on:"#FFFFFF",name:"My BMW"},
  mini:{dark:1,bg:"#000000",card:"#171717",fg:"#FFFFFF",mut:"#A3A3A3",line:"#2A2A2A",acc:"#FFFFFF",on:"#000000",name:"MINI"},
  peugeot:{bg:"#F2F3F5",card:"#FFFFFF",fg:"#0B1220",mut:"#6B7280",line:"#E3E5E9",acc:"#0B1220",on:"#FFFFFF",hd:"#0B1220",hdfg:"#FFFFFF"},
  citroen:{bg:"#F4F4F4",card:"#FFFFFF",fg:"#1D1D1B",mut:"#6F6F6E",line:"#E3E3E3",acc:"#DA291C",on:"#FFFFFF",hd:"#FFFFFF",hdfg:"#1D1D1B"},
  opel:{bg:"#F3F3F3",card:"#FFFFFF",fg:"#000000",mut:"#666666",line:"#E0E0E0",acc:"#F7FF14",on:"#000000",hd:"#000000",hdfg:"#FFFFFF"},
  ds:{dark:1,bg:"#121212",card:"#1D1D1D",fg:"#F3EFE7",mut:"#A39E94",line:"#2E2C29",acc:"#B6995A",on:"#121212"},
  fiat:{bg:"#F6F4F2",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B6B",line:"#E6E1DC",acc:"#C8102E",on:"#FFFFFF",hd:"#C8102E",hdfg:"#FFFFFF"},
  jeep:{bg:"#F1F1EC",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B66",line:"#DFDFD7",acc:"#3E4A2C",on:"#FFFFFF",hd:"#2B3320",hdfg:"#FFFFFF"},
  alfa:{dark:1,bg:"#0E0E0E",card:"#1A1A1A",fg:"#FFFFFF",mut:"#A3A3A3",line:"#2A2A2A",acc:"#B5132F",on:"#FFFFFF"},
  renault:{bg:"#FFFFFF",card:"#F4F4F4",fg:"#000000",mut:"#666666",line:"#E2E2E2",acc:"#EFDF00",on:"#000000"},
  dacia:{bg:"#F2F2EE",card:"#FFFFFF",fg:"#1E1E1E",mut:"#6B6B66",line:"#E1E1DA",acc:"#646B52",on:"#FFFFFF",hd:"#646B52",hdfg:"#FFFFFF"},
  vw:{bg:"#EEF2F7",card:"#FFFFFF",fg:"#001E50",mut:"#5B6B85",line:"#DCE3EE",acc:"#001E50",on:"#FFFFFF"},
  audi:{dark:1,bg:"#000000",card:"#161616",fg:"#FFFFFF",mut:"#9E9E9E",line:"#2A2A2A",acc:"#FFFFFF",on:"#000000"},
  skoda:{dark:1,bg:"#0E3A2F",card:"#17473A",fg:"#FFFFFF",mut:"#9DBDB2",line:"#215545",acc:"#78FAAE",on:"#0E3A2F"},
  cupra:{dark:1,bg:"#111111",card:"#1C1C1C",fg:"#FFFFFF",mut:"#A3A3A3",line:"#2C2C2C",acc:"#C27C4E",on:"#111111"},
  hyundai:{dark:1,bg:"#002C5F",card:"#0B3D78",fg:"#FFFFFF",mut:"#A9C1DD",line:"#18508F",acc:"#00AAD2",on:"#002C5F",name:"myHyundai"},
  kia:{dark:1,bg:"#05141F",card:"#132633",fg:"#FFFFFF",mut:"#9FB0BC",line:"#203645",acc:"#FFFFFF",on:"#05141F",name:"Kia"},
  genesis:{dark:1,bg:"#0B0B0B",card:"#191919",fg:"#FFFFFF",mut:"#A3A3A3",line:"#2A2A2A",acc:"#C59E77",on:"#0B0B0B"},
  mercedes:{dark:1,bg:"#000000",card:"#121212",fg:"#FFFFFF",mut:"#9A9A9A",line:"#262626",acc:"#00ADEF",on:"#000000",name:"Mercedes-Benz"},
  volvo:{bg:"#FAFAF8",card:"#FFFFFF",fg:"#141414",mut:"#707070",line:"#E6E6E3",acc:"#141414",on:"#FFFFFF",name:"Volvo Cars"},
  polestar:{dark:1,bg:"#101010",card:"#1B1B1B",fg:"#FFFFFF",mut:"#9C9C9C",line:"#2A2A2A",acc:"#D96C00",on:"#101010",name:"Polestar"},
  mg:{bg:"#F4F5F7",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B6B",line:"#E3E5E8",acc:"#C8102E",on:"#FFFFFF",hd:"#E9EBEF",hdfg:"#1A1A1A",name:"MG iSMART"},
  ford:{bg:"#F4F6FA",card:"#FFFFFF",fg:"#00095B",mut:"#5C6687",line:"#DFE3EE",acc:"#066FEF",on:"#FFFFFF",hd:"#00095B",hdfg:"#FFFFFF",name:"Ford"},
  toyota:{bg:"#F5F5F5",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B6B",line:"#E2E2E2",acc:"#EB0A1E",on:"#FFFFFF",hd:"#FFFFFF",hdfg:"#1A1A1A",name:"MyToyota"},
  lexus:{dark:1,bg:"#0F0F0F",card:"#1C1C1C",fg:"#FFFFFF",mut:"#A3A3A3",line:"#2A2A2A",acc:"#B9975B",on:"#0F0F0F"},
  nissan:{bg:"#F5F5F5",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B6B",line:"#E2E2E2",acc:"#C3002F",on:"#FFFFFF",hd:"#1F1F1F",hdfg:"#FFFFFF"},
  porsche:{bg:"#EEEFF2",card:"#FFFFFF",fg:"#010205",mut:"#6B6D70",line:"#DDDFE3",acc:"#010205",on:"#FFFFFF"},
  honda:{bg:"#F5F5F5",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B6B",line:"#E2E2E2",acc:"#CC0000",on:"#FFFFFF",hd:"#FFFFFF",hdfg:"#1A1A1A"},
  mazda:{dark:1,bg:"#0E0E10",card:"#1B1B1F",fg:"#FFFFFF",mut:"#A1A1AA",line:"#2A2A30",acc:"#B0123B",on:"#FFFFFF",name:"MyMazda"},
  jlr:{dark:1,bg:"#11161A",card:"#1C2328",fg:"#FFFFFF",mut:"#A0ABB2",line:"#2A333A",acc:"#FFFFFF",on:"#11161A"},
  landrover:{bg:"#F4F5F3",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B6B",line:"#E2E3E0",acc:"#005A2B",on:"#FFFFFF"},
  smart:{dark:1,bg:"#0D0D0D",card:"#1C1C1E",fg:"#FFFFFF",mut:"#A3A3A3",line:"#2C2C2E",acc:"#FFFFFF",on:"#0D0D0D"},
  nio:{dark:1,bg:"#06202F",card:"#0F2E40",fg:"#FFFFFF",mut:"#9DB6C4",line:"#1A3B4F",acc:"#00BEBE",on:"#06202F"},
  xpeng:{dark:1,bg:"#0B0F14",card:"#161C24",fg:"#FFFFFF",mut:"#9AA3AE",line:"#222A34",acc:"#2BD982",on:"#0B0F14"},
  byd:{bg:"#F3F6FA",card:"#FFFFFF",fg:"#14213D",mut:"#5C6B84",line:"#DEE5EE",acc:"#1F5FD6",on:"#FFFFFF",hd:"#DCE8F7",hdfg:"#14213D",name:"BYD"},
  cn:{bg:"#F3F5F8",card:"#FFFFFF",fg:"#111827",mut:"#6B7280",line:"#E5E7EB",acc:"#2563EB",on:"#FFFFFF"},
  wb:{bg:"#F4F7F6",card:"#FFFFFF",fg:"#14231F",mut:"#5F6F6A",line:"#DDE5E2",acc:"#146B4F",on:"#FFFFFF",name:"App da wallbox"},
  generic:{bg:"#F3F5F8",card:"#FFFFFF",fg:"#111827",mut:"#6B7280",line:"#E5E7EB",acc:"#382F83",on:"#FFFFFF"}
};
/* Linguagem visual de cada app (o que torna cada ilustração reconhecível):
   home: tesla | bmw | band (carro sobre faixa de cor) | ring (indicador circular) | min (foto de ponta a ponta) | dash (painel com indicadores)
   list: card (lista agrupada) | sep (cartões separados) | flat (linhas finas)      hd: l | c | L (título grande)
   sw: ios | md (Material) | sq (quadrado)     time: chip | plain | pair (início/fim lado a lado) | field (campo com etiqueta)
   day: circle | pill | square | text | ring    btn: fill | sq | outline | full (barra inferior) | nav (no cabeçalho)
   batt: bar | ring | cell      seg: pill | line      tabs: n.º de separadores, tabsL: nomes, ind: plain | pill | bar
   quick: round | lab | sq      band: cabeçalho colorido (usa hd/hdfg)      ff/hf: letra do texto/títulos      up: títulos em maiúsculas */
const FONT={inter:"'Inter',system-ui,sans-serif",mont:"'Montserrat',system-ui,sans-serif",dm:"'DM Sans',system-ui,sans-serif",pop:"'Poppins',system-ui,sans-serif",rob:"'Roboto',system-ui,sans-serif",src:"'Source Sans 3','Helvetica Neue',sans-serif",serif:"Georgia,'Times New Roman',serif"};
const SKIN={
  tesla:{short:1,home:"tesla",list:"flat",hd:"c",sw:"ios",time:"pair",day:"text",btn:"fill",batt:"cell",seg:"line",r:"10px",br:"6px",tabs:0,quick:"round",ff:FONT.mont,tw:600,licon:1},
  bmw:{short:1,home:"bmw",list:"sep",hd:"L",sw:"ios",time:"chip",day:"circle",btn:"sq",batt:"bar",seg:"pill",r:"12px",br:"6px",tabs:4,tabsL:["Veículo","Mapa","Serviços","Perfil"],ind:"plain",quick:"sq",ff:FONT.inter,tw:700,licon:1},
  mini:{short:1,home:"bmw",list:"card",hd:"L",sw:"ios",time:"plain",day:"pill",btn:"fill",batt:"ring",seg:"pill",r:"18px",br:"999px",tabs:4,tabsL:["Carro","Mapa","Serviços","Perfil"],ind:"pill",quick:"round",ff:FONT.pop,tw:600,licon:1},
  peugeot:{home:"band",band:1,list:"sep",hd:"c",sw:"md",time:"field",day:"square",btn:"sq",batt:"bar",seg:"line",r:"6px",br:"4px",tabs:4,tabsL:["Início","Mapa","Serviços","Perfil"],ind:"bar",homeLinks:"tiles",ff:FONT.pop,tw:600,up:1},
  citroen:{home:"band",band:1,list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"16px",br:"999px",tabs:4,tabsL:["Início","Mapa","Serviços","Conta"],ind:"pill",homeLinks:"tiles",ff:FONT.dm,tw:700},
  opel:{home:"band",band:1,list:"sep",hd:"l",sw:"md",time:"field",day:"square",btn:"sq",batt:"bar",seg:"line",r:"4px",br:"2px",tabs:4,tabsL:["Início","Mapa","Serviços","Perfil"],ind:"bar",homeLinks:"tiles",ff:FONT.rob,tw:700,up:1},
  ds:{home:"min",list:"flat",hd:"c",sw:"sq",time:"plain",day:"text",btn:"outline",batt:"bar",seg:"line",r:"2px",br:"2px",tabs:4,ind:"bar",ff:FONT.src,hf:FONT.serif,tw:400,up:1,licon:1},
  fiat:{home:"band",band:1,list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"16px",br:"999px",tabs:4,tabsL:["Início","Mapa","Serviços","Perfil"],ind:"pill",homeLinks:"tiles",ff:FONT.pop,tw:600},
  jeep:{home:"band",band:1,list:"sep",hd:"l",sw:"md",time:"field",day:"square",btn:"sq",batt:"bar",seg:"line",r:"4px",br:"2px",tabs:4,tabsL:["Início","Mapa","Serviços","Perfil"],ind:"bar",homeLinks:"tiles",ff:FONT.rob,tw:700,up:1},
  alfa:{home:"min",list:"flat",hd:"c",sw:"sq",time:"plain",day:"square",btn:"sq",batt:"cell",seg:"line",r:"4px",br:"2px",tabs:4,ind:"bar",ff:FONT.inter,tw:500,up:1,licon:1},
  renault:{home:"min",list:"flat",hd:"L",sw:"ios",time:"pair",day:"pill",btn:"sq",batt:"bar",seg:"line",r:"0",br:"0",tabs:4,tabsL:["Início","Mapa","Serviços","Conta"],ind:"bar",ff:FONT.mont,tw:700,licon:1},
  dacia:{home:"band",band:1,list:"sep",hd:"l",sw:"md",time:"field",day:"square",btn:"sq",batt:"bar",seg:"line",r:"4px",br:"4px",tabs:4,tabsL:["Início","Mapa","Serviços","Perfil"],ind:"bar",ff:FONT.rob,tw:700},
  vw:{short:1,ringc:"#2F7DE1",home:"ring",list:"card",hd:"c",sw:"ios",time:"plain",day:"pill",btn:"fill",batt:"ring",seg:"pill",r:"14px",br:"999px",tabs:4,tabsL:["Carro","Mapa","Carregar","Perfil"],ind:"plain",ff:FONT.dm,tw:700,licon:1},
  audi:{home:"min",list:"flat",hd:"l",sw:"sq",time:"chip",day:"square",btn:"full",batt:"bar",seg:"line",r:"0",br:"0",tabs:4,tabsL:["Veículo","Mapa","Serviços","Perfil"],ind:"bar",ff:FONT.rob,tw:500,licon:1},
  skoda:{ringc:"#78FAAE",home:"ring",list:"sep",hd:"L",sw:"md",time:"chip",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"14px",br:"999px",tabs:4,tabsL:["Carro","Mapa","Serviços","Perfil"],ind:"pill",ff:FONT.inter,tw:700,licon:1},
  cupra:{home:"ring",list:"flat",hd:"l",sw:"sq",time:"chip",day:"square",btn:"sq",batt:"ring",seg:"line",r:"2px",br:"2px",tabs:4,ind:"bar",ff:FONT.mont,tw:600,up:1,licon:1},
  hyundai:{ringc:"#00AAD2",home:"dash",list:"sep",hd:"c",sw:"ios",time:"pair",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"14px",br:"999px",tabs:4,tabsL:["Início","Estado","Controlo","Serviços"],ind:"plain",quick:"lab",ff:FONT.dm,tw:700},
  kia:{home:"dash",list:"sep",hd:"l",sw:"md",time:"field",day:"pill",btn:"fill",batt:"bar",seg:"pill",r:"8px",br:"999px",tabs:4,tabsL:["Início","Controlo","Mapa","Menu"],ind:"pill",quick:"round",ff:FONT.pop,tw:600},
  genesis:{home:"min",list:"flat",hd:"c",sw:"sq",time:"plain",day:"square",btn:"outline",batt:"cell",seg:"line",r:"2px",br:"2px",tabs:0,ff:FONT.src,hf:FONT.serif,tw:400,up:1,licon:1},
  mercedes:{home:"min",list:"flat",hd:"c",sw:"ios",time:"plain",day:"ring",btn:"sq",batt:"bar",seg:"line",r:"4px",br:"4px",tabs:5,tabsL:["Início","Mapa","Loja","Carregar","Perfil"],ind:"bar",ff:FONT.src,tw:600,licon:1},
  volvo:{short:1,home:"min",list:"flat",hd:"L",sw:"ios",time:"plain",day:"square",btn:"sq",batt:"cell",seg:"line",r:"4px",br:"4px",tabs:3,tabsL:["Carro","Mapa","Perfil"],ind:"plain",ff:FONT.inter,tw:500,licon:1},
  polestar:{short:1,home:"min",list:"flat",hd:"L",sw:"sq",time:"pair",day:"square",btn:"full",batt:"cell",seg:"line",r:"0",br:"0",tabs:4,ind:"bar",ff:FONT.inter,tw:400,licon:1},
  mg:{home:"band",band:1,list:"sep",hd:"c",sw:"md",time:"field",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"14px",br:"999px",tabs:4,tabsL:["Início","Serviços","Loja","Eu"],ind:"pill",quick:"lab",homeLinks:"tiles",ff:FONT.rob,tw:700},
  ford:{home:"band",band:1,list:"sep",hd:"c",sw:"md",time:"field",day:"pill",btn:"fill",batt:"bar",seg:"pill",r:"12px",br:"999px",tabs:5,tabsL:["Início","Mapa","Carregar","Loja","Conta"],ind:"pill",ff:FONT.dm,tw:700,licon:1},
  toyota:{home:"band",band:1,list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"10px",br:"999px",tabs:5,tabsL:["Início","Mapa","Serviços","Carregar","Conta"],ind:"plain",ff:FONT.inter,tw:700,licon:1},
  lexus:{home:"min",list:"flat",hd:"c",sw:"sq",time:"plain",day:"text",btn:"outline",batt:"cell",seg:"line",r:"2px",br:"2px",tabs:4,ind:"bar",ff:FONT.src,tw:400,up:1,licon:1},
  nissan:{home:"band",band:1,list:"flat",hd:"l",sw:"md",time:"field",day:"square",btn:"sq",batt:"bar",seg:"line",r:"4px",br:"4px",tabs:5,tabsL:["Início","Mapa","Carregar","Serviços","Mais"],ind:"bar",ff:FONT.rob,tw:700,licon:1},
  porsche:{home:"min",list:"card",hd:"L",sw:"sq",time:"chip",day:"square",btn:"sq",batt:"bar",seg:"pill",r:"4px",br:"4px",tabs:4,tabsL:["Carro","Mapa","Loja","Perfil"],ind:"bar",ff:FONT.inter,tw:600,licon:1},
  honda:{home:"ring",list:"flat",hd:"l",sw:"md",time:"field",day:"square",btn:"sq",batt:"bar",seg:"line",r:"6px",br:"4px",tabs:4,tabsL:["Início","Remoto","Mapa","Mais"],ind:"bar",ringc:"#CC0000",ff:FONT.rob,tw:700,licon:1},
  mazda:{home:"min",list:"flat",hd:"c",sw:"sq",time:"chip",day:"square",btn:"sq",batt:"bar",seg:"line",r:"4px",br:"4px",tabs:4,tabsL:["Início","Remoto","Mapa","Mais"],ind:"bar",ff:FONT.inter,tw:600,licon:1},
  jlr:{home:"min",list:"flat",hd:"l",sw:"sq",time:"chip",day:"square",btn:"full",batt:"bar",seg:"line",r:"0",br:"0",tabs:4,ind:"bar",ff:FONT.src,tw:600,up:1,licon:1},
  landrover:{home:"min",list:"flat",hd:"l",sw:"md",time:"chip",day:"square",btn:"sq",batt:"bar",seg:"line",r:"0",br:"2px",tabs:4,ind:"bar",ff:FONT.src,tw:600,up:1,licon:1},
  smart:{home:"dash",list:"card",hd:"L",sw:"ios",time:"pair",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"20px",br:"999px",tabs:4,tabsL:["Carro","Mapa","Loja","Eu"],ind:"plain",quick:"round",ff:FONT.pop,tw:600},
  nio:{ringc:"#00BEBE",home:"dash",list:"card",hd:"c",sw:"ios",time:"pair",day:"pill",btn:"fill",batt:"ring",seg:"pill",r:"16px",br:"999px",tabs:5,tabsL:["Início","Explorar","Carro","Serviços","Eu"],ind:"plain",quick:"lab",ff:FONT.inter,tw:600},
  xpeng:{home:"dash",list:"sep",hd:"c",sw:"md",time:"field",day:"pill",btn:"fill",batt:"bar",seg:"pill",r:"16px",br:"999px",tabs:4,tabsL:["Carro","Explorar","Loja","Eu"],ind:"plain",quick:"round",ff:FONT.rob,tw:700},
  byd:{ringc:"#1F5FD6",home:"band",band:1,list:"sep",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"16px",br:"999px",tabs:4,tabsL:["Início","Veículo","Serviços","Eu"],ind:"plain",quick:"lab",ff:FONT.inter,tw:700,licon:1},
  cn:{home:"dash",list:"sep",hd:"c",sw:"md",time:"field",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"14px",br:"999px",tabs:4,tabsL:["Carro","Serviços","Loja","Eu"],ind:"pill",quick:"lab",ff:FONT.rob,tw:700},
  wb:{list:"card",hd:"l",sw:"ios",time:"pair",day:"circle",btn:"fill",batt:"bar",seg:"pill",r:"14px",br:"999px",tabs:0,ff:FONT.inter,tw:700},
  generic:{home:"dash",list:"card",hd:"l",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"bar",seg:"pill",r:"14px",br:"999px",tabs:4,ind:"plain",quick:"round",ff:FONT.inter,tw:700,licon:1}
};
/* Tema por marca (sobrepõe o tema do guia nas apps de telemóvel) */
const BRAND_THEME={"Peugeot":"peugeot","Citroën":"citroen","Opel":"opel","DS Automobiles":"ds","Fiat":"fiat","Abarth":"alfa","Alfa Romeo":"alfa","Lancia":"peugeot","Jeep":"jeep",
  "Audi":"audi","Škoda":"skoda","CUPRA":"cupra","SEAT":"vw","Volkswagen":"vw","Hyundai":"hyundai","Kia":"kia","Genesis":"genesis","Mini":"mini","Lexus":"lexus",
  "Jaguar":"jlr","Land Rover":"landrover","Renault":"renault","Alpine":"renault","Mazda":"mazda","Denza":"byd"};

/* Linhas: hero | link(label,sub) | sect | radio(label,on) | tog(label,on) | time(label,S/E) | days | seg(opts,idx) | val(label,v) | slider(label,%) | note | warn | tiles([..],idx)
   Ecrã: {t:título, k:"app"|"car"|"wb", th:tema, rows, btn, hl:[índices destacados], cap:legenda}
   map: ecrã mostrado por cada passo */
const GUIDES={
tesla:{level:OK, th:"tesla",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Controlos"],["link","Climatização"],["link","Carregamento","Ligado · 80 %"],["link","Localização"]],hl:[3]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["slider","Limite de carga",80],["link","Agendar","Sem agendamentos"]],hl:[2]},
    {t:"Agendar",cap:"Agendar carregamento",rows:[["seg",["Carregamento","Partida"],0],["time","Começar às","S"],["time","Terminar às","E"],["days"],["val","Localização","Casa"]],btn:"Guardar",hl:[1,2]}
  ],
  map:[0,1,2,1],
  steps:[
    "Abra a app {app} e toque em <b>Carregamento</b>.",
    "Toque em <b>Agendar</b> e escolha o separador <b>Carregamento</b> (não «Partida»).",
    "Defina <b>Começar às</b> {inicio} e <b>Terminar às</b> {fim}, escolha os dias e guarde. O horário fica associado à localização «Casa».",
    "Ligue o cabo. A app deve mostrar que o carregamento está agendado."
  ],
  power:"Com o cabo ligado, ajuste a corrente com os botões <b>−</b> e <b>+</b> no ecrã de carregamento (app ou carro). O valor fica guardado para casa.",
  tip:"Defina sempre a hora de fim. Se usar apenas a <b>Partida</b> e o vazio não chegar para completar a carga, o carro continua a carregar depois de o vazio acabar."
},
bmw:{level:IND, th:"bmw",
  screens:[
    {t:"",cap:"Ecrã inicial do carro na app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"],["link","Climatização"],["link","Localização do veículo"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["slider","Objetivo de carga",80],["link","Temporizador de carga e climatização","Modo de carregamento · Partidas"]],hl:[1,2]},
    {t:"Modo de carregamento",cap:"Modo de carregamento",rows:[["radio","Carregar imediatamente",0],["radio","Carregar no intervalo de tempo",1],["time","Início","S"],["time","Fim","E"]],btn:"Guardar",hl:[1,2,3]},
    {t:"Hora de partida",cap:"Hora de partida (obrigatória)",rows:[["tog","Partida 1",1],["time","Hora de partida","E"],["days"],["tog","Climatização",0],["warn","Sem uma partida ativa, o intervalo de tempo não é aplicado."]],btn:"Guardar",hl:[0,1]}
  ],
  map:[0,1,2,3,1],
  steps:[
    "Na app {app}, no ecrã do seu carro, toque em <b>Carregamento</b>.",
    "Defina o <b>objetivo de carga</b> (por exemplo, 80%) e abra o <b>temporizador de carga e climatização</b>. Em algumas versões da app, a opção chama-se <b>Definições de carregamento</b>.",
    "Em <b>Modo de carregamento</b>, escolha <b>Carregar no intervalo de tempo</b> e defina o início às {inicio} e o fim às {fim}.",
    "Ative uma <b>hora de partida</b> às {fim} para os dias em que quer carregar. Sem uma partida ativa, o intervalo não é aplicado. Desligue a climatização, se não precisar dela.",
    "Guarde e ligue o cabo. O carro pode carregar alguns minutos e depois parar até à hora de início. É normal."
  ],
  power:"No ecrã do carro (iDrive), no menu de <b>carregamento</b>, procure o limite de <b>corrente de carga AC</b>. Em alguns modelos, a mesma opção também aparece na app.",
  tip:"<b>Atenção:</b> o BMW dá prioridade a atingir o objetivo de carga até à hora de partida. Se a bateria estiver muito descarregada, pode começar antes das {inicio} ou continuar depois das {fim}. Para garantir que só carrega no vazio, escolha <b>Carregar imediatamente</b> e programe o horário na wallbox. Alguns textos da app pode aparecer em português do Brasil."
},
volkswagen:{level:OK, th:"vw",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"],["link","Climatização"],["link","Estado do veículo"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Locais de carregamento","Casa"],["val","Nível máximo de carga","80 %"]],hl:[1]},
    {t:"Casa",cap:"Local de carregamento «Casa»",rows:[["tog","Horas de carregamento preferenciais",1],["time","Início","S"],["time","Fim","E"],["val","Nível mínimo de carga","0 %"],["tog","Reduzir corrente de carga AC",0]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app}, escolha o carro e toque em <b>Carregamento</b>. No ecrã do carro, o menu tem o mesmo nome.",
    "Abra <b>Locais de carregamento</b> e escolha «Casa». Se ainda não existir, crie-o no ecrã do carro, com o carro estacionado em casa.",
    "Ative <b>Horas de carregamento preferenciais</b>, defina {inicio}–{fim} e ponha o <b>Nível mínimo de carga</b> a 0%.",
    "Guarde. O horário fica associado a esse local e é aplicado sempre que carregar em casa."
  ],
  power:"No local «Casa», ative <b>Reduzir corrente de carga AC</b>. Normalmente, as opções são apenas «máxima» e «reduzida».",
  tip:"Até atingir o nível mínimo, o carro carrega logo que é ligado, mesmo fora do vazio. Por isso convém pô-lo a 0%. Nos ID. com software mais antigo, a criação de locais só existe no ecrã do carro."
},

vw:{level:IND, th:"vw",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"],["link","Climatização"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Perfis de carregamento","Casa"],["val","Nível máximo de carga","80 %"]],hl:[1]},
    {t:"Casa",cap:"Perfil «Casa»",rows:[["tog","Horário de carregamento preferencial",1],["time","Início","S"],["time","Fim","E"],["val","Nível mínimo de carga","0 %"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app}, escolha o carro e entre em <b>Carregamento</b>.",
    "Abra os <b>perfis</b> (ou <b>locais</b>) <b>de carregamento</b> e crie «Casa».",
    "Ative o <b>horário de carregamento preferencial</b> (ou um <b>temporizador</b>) de {inicio} a {fim}.",
    "Se existir <b>nível mínimo de carga</b>, ponha-o a 0% e guarde."
  ],
  power:"No mesmo perfil, procure <b>Corrente de carga AC</b> e escolha «reduzida», se precisar.",
  tip:"O horário só funciona no local onde foi criado. Noutro sítio, o carro carrega logo que é ligado."
},
stellantis:{level:OK, th:"peugeot",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["tiles",["Carregamento","Climatização","Trajetos","Manutenção"],0]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento diferido (app)",rows:[["batt",62],["tog","Carregamento diferido",1],["time","Hora de início","S"],["note","Em algumas versões também é possível escolher a hora de fim."]],btn:"Guardar",hl:[1,2]}
  ],
  map:[0,1,1,1],
  steps:[
    "Abra a app {app}, escolha o carro e toque em <b>Carregamento</b>.",
    "Ative o <b>carregamento diferido</b> e defina a hora de início às {inicio}.",
    "Guarde e ligue o cabo. O carro fica à espera até às {inicio} e depois carrega até ao fim.",
    "Também pode fazer isto no ecrã do carro: menu <b>Electric</b> › <b>Carregamento</b>."
  ],
  power:"A maioria destes modelos não permite limitar a corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:"Em muitas versões só se escolhe a hora de início. Com o vazio das {inicio} às {fim}, uma carga normal costuma caber. Se precisar de garantir que para às {fim}, use o horário da wallbox em vez do carro."
},
byd:{level:IND, th:"byd",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"],["link","Ar condicionado"],["link","Localização do veículo"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Carregamento agendado","Desligado"],["val","Limite de carga","90 %"]],hl:[1]},
    {t:"Carregamento agendado",cap:"Carregamento agendado",rows:[["tog","Carregamento agendado",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app} e, no ecrã inicial, toque no cartão de <b>Carregamento</b> (bateria).",
    "Toque em <b>Carregamento agendado</b> e ative a opção.",
    "Defina o início às {inicio} e o fim às {fim}, escolha os dias e guarde.",
    "No ecrã do carro, a mesma opção está em <b>Energia</b> (ou <b>Nova Energia</b>) › <b>Carregar/Descarregar</b>. Desligue e tranque o carro antes de ligar o cabo."
  ],
  power:"Se o menu de carregamento do carro não tiver opção de corrente, ajuste-a na wallbox.",
  tip:"Os nomes dos menus variam com o modelo e a versão da app. Se, com a sua wallbox, o carro não começar a carregar à hora marcada, desligue o agendamento no carro e programe o horário na wallbox."
},

renault:{level:IND, th:"renault",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"],["link","Climatização"],["link","Localizar o veículo"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Programar carregamento","Carga agendada"],["slider","Nível de carga máxima",80]],hl:[1]},
    {t:"Carga agendada",cap:"Carga agendada",rows:[["tog","Carga agendada",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2,1],
  steps:[
    "Abra a app {app}, escolha o carro e toque em <b>Carregamento</b>.",
    "Abra a programação do carregamento e escolha <b>Carga agendada</b>.",
    "Defina a hora de início às {inicio} e a hora de fim às {fim}.",
    "Selecione os dias da semana e guarde. Sem nenhum dia selecionado, o programa não fica guardado.",
    "Opcional: defina o <b>nível de carga máxima</b> (por exemplo, 80%). No ecrã do carro (openR link), o mesmo está em <b>Veículo › Elétrico › Programas › Definições de carga</b>."
  ],
  power:"Se o menu de carregamento do carro tiver <b>corrente de carga AC</b>, pode ajustá-la aí. Se não tiver, ajuste-a na wallbox.",
  tip:"Não use a opção de <b>hora de partida</b> para isto: define a hora a que o carro deve estar pronto, não o horário de vazio. Os nomes exatos dos menus variam entre o ZOE, o Mégane E-Tech, o Scenic e o 5 E-Tech."
},

dacia:{level:IND, th:"dacia",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 %"],["link","Climatização"]],hl:[1]},
    {t:"Programar carregamento",cap:"Programar carregamento",rows:[["tog","Programação",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,1,1],
  steps:[
    "Abra a app {app} e associe o carro. É preciso ter os serviços conectados ativos.",
    "Entre em <b>Carregamento › Programar carregamento</b>.",
    "Defina {inicio}–{fim} e os dias, e guarde.",
    "Na primeira noite, confirme que o carregamento começou à hora certa."
  ],
  power:"O Spring não permite limitar a corrente na app. Se for preciso, ajuste-a na wallbox.",
  tip:"Se o seu Spring não tiver serviços conectados, programe o horário na wallbox."
},
mercedes:{level:IND, th:"mercedes",
  screens:[
    {t:"Carregamento",cap:"App Mercedes-Benz: só há hora de partida",rows:[["batt",62],["link","Programa de carregamento","Padrão"],["slider","Nível máximo de carga",80],["note","Na maioria dos modelos não há hora de início."]],hl:[3]},
    {t:"Horário de carregamento",k:"wb",th:"wb",cap:"App da wallbox: horário do vazio",rows:[["tog","Carregar só neste horário",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,0,1,1],
  steps:[
    "Na app {app}, entre em <b>Carregamento</b> e escolha o programa de carregamento («Padrão» ou «Casa») e o nível máximo de carga.",
    "Muitos modelos não deixam escolher a hora de início, apenas a hora de partida.",
    "Para carregar só no vazio, programe o horário {inicio}–{fim} na <b>wallbox</b> e deixe o carro em carregamento imediato.",
    "Na primeira noite, confirme que o carro começou a carregar à hora certa."
  ],
  power:"No ecrã MBUX, em <b>Veículo › Carregamento</b>, procure <b>Corrente de carga AC</b> («máxima», «reduzida» ou «mínima», consoante o modelo).",
  tip:"Nos modelos sem hora de início na app, quem controla o horário é a wallbox."
},
hk:{level:IND, th:"hyundai",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"],["link","Climatização"]],hl:[1]},
    {t:"Carregamento planeado",cap:"Horário fora de hora de ponta",rows:[["tog","Carregamento planeado",1],["time","Início","S"],["time","Fim","E"],["seg",["Priorizadas","Só fora de ponta"],1]],btn:"OK",hl:[0,1,2,3]}
  ],
  map:[0,1,1,1],
  steps:[
    "Abra a app {app} e entre no agendamento do carregamento. No ecrã do carro, o caminho é <b>EV › Gestão de carregamento › Carregam/Climatiz.</b>",
    "Ative o <b>Carregamento planeado</b> e defina o horário fora de hora de ponta: {inicio}–{fim}.",
    "Escolha <b>Apenas tarifas fora das horas de ponta</b>, para que o carro não carregue fora desse horário.",
    "Confirme com <b>OK</b> (ou envie a partir da app) e espere pela mensagem de confirmação."
  ],
  power:"No ecrã do carro, em <b>EV › Gestão de carregamento</b>, procure <b>Corrente de carga CA</b> e escolha um valor mais baixo. Também pode definir o <b>Limite de carregamento (CA)</b>.",
  tip:"O carregamento planeado só começa se o cabo já estiver ligado à hora marcada."
},
volvo:{level:IND, th:"volvo",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"],["link","Climatização"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["slider","Limite de carga",90],["link","Carregamento agendado","Desligado"]],hl:[2]},
    {t:"Carregamento agendado",cap:"Horário de carregamento",rows:[["tog","Horário 1",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,1],
  steps:[
    "Abra a app {app}, escolha o carro e entre em <b>Carregamento</b>.",
    "Toque em <b>Carregamento agendado</b> e adicione um horário. Em alguns modelos, a opção só existe no ecrã central.",
    "Defina {inicio}–{fim}, escolha os dias e guarde.",
    "Confirme o limite de carga."
  ],
  power:"No ecrã central, nas definições de carregamento, procure <b>limite de corrente</b> e escolha o valor pretendido.",
  tip:""
},
polestar:{level:IND, th:"polestar",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"],["link","Climatização"],["link","Estado do veículo"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento: horários",rows:[["batt",62],["slider","Limite de carga",90],["sect","Horários de carregamento"],["tog","Horário 1 · {inicio}–{fim}",1],["note","Os horários criam-se no ecrã central e podem ser ligados ou desligados aqui."]],hl:[3]}
  ],
  map:[1,1,1,0],
  steps:[
    "No ecrã central do carro, abra <b>Carregamento</b> e crie um <b>horário de carregamento</b>.",
    "Defina o horário de {inicio} a {fim} e escolha os dias.",
    "Confirme o limite de carga. Na app {app}, em <b>Carregamento</b>, pode ver o horário e ligá-lo ou desligá-lo.",
    "Mantenha a app e o software do carro atualizados. As opções da app têm vindo a aumentar."
  ],
  power:"No mesmo menu do ecrã central, procure <b>Corrente de carga AC</b> (ou «limite de corrente»).",
  tip:""
},

mg:{level:IND, th:"mg",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["tiles",["Carregamento","Climatização","Trancar","Localizar"],0]],hl:[1]},
    {t:"Carregamento agendado",cap:"Carregamento agendado",rows:[["tog","Agendamento",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,1,1],
  steps:[
    "Abra a app {app} e escolha o carro.",
    "Entre em <b>Carregamento › Carregamento agendado</b>.",
    "Defina {inicio}–{fim} e a repetição, e guarde.",
    "Também pode programar no ecrã do carro, no menu de energia."
  ],
  power:"No ecrã do carro, no menu de carregamento, procure o <b>limite de corrente AC</b>.",
  tip:""
},
ford:{level:IND, th:"ford",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"],["link","Locais de carregamento"]],hl:[2]},
    {t:"Casa",cap:"Local «Casa»",rows:[["tog","Horários de carregamento preferidos",1],["time","Início","S"],["time","Fim","E"],["val","Nível de carga","80 %"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,0,1,1],
  steps:[
    "Abra a app {app} (antiga FordPass) e escolha o carro.",
    "Entre em <b>Carregamento › Locais de carregamento</b> e escolha ou crie «Casa».",
    "Ative os <b>horários de carregamento preferidos</b> e defina {inicio}–{fim}.",
    "Defina o nível de carga e guarde."
  ],
  power:"Em alguns modelos, o ecrã do carro tem <b>Corrente de carga AC</b>. Nos restantes, ajuste-a na wallbox.",
  tip:""
},
toyota:{level:IND, th:"toyota", rows:[["tog","Horário",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Programação de carregamento",
  steps:[
    "Abra a app {app} e escolha o carro.",
    "Entre em <b>Carregamento › Programação de carregamento</b>.",
    "Crie um horário com início às {inicio} e fim às {fim}.",
    "Escolha os dias e ative o horário."
  ],
  power:"Normalmente não há limite de corrente na app. Se for preciso, ajuste-a na wallbox.",
  tip:""
},
nissan:{level:IND, th:"nissan", rows:[["tog","Temporizador 1",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Temporizador de carregamento",
  steps:[
    "Abra a app {app} e escolha o carro.",
    "Entre em <b>Carregamento</b> e procure os <b>temporizadores de carregamento</b>.",
    "Crie um temporizador de {inicio} a {fim} e escolha os dias.",
    "Nos LEAF mais antigos, o temporizador configura-se no ecrã do carro."
  ],
  power:"Na maioria dos modelos não há limite de corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:""
},
porsche:{level:IND, th:"porsche", rows:[["tog","Horário preferencial",1],["time","Início","S"],["time","Fim","E"],["val","Nível de carga","80 %"]], title:"Perfil «Casa»",
  steps:[
    "Abra a app {app} e entre em <b>Carregamento</b>.",
    "Crie ou abra o perfil de carregamento «Casa».",
    "Ative o <b>horário preferencial</b> de {inicio} a {fim}.",
    "Defina o nível de carga e ative o temporizador para os dias pretendidos."
  ],
  power:"No ecrã PCM, no perfil «Casa», procure <b>Corrente de carga máxima</b>.",
  tip:""
},
honda:{level:IND, th:"honda", rows:[["tog","Horário",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Programação de carregamento",
  steps:[
    "Abra a app {app} e escolha o carro.",
    "Entre em <b>Carregamento › Programação de carregamento</b>.",
    "Adicione um horário de {inicio} a {fim}, escolha os dias e guarde.",
    "Também pode programar no ecrã do carro, nas definições de carregamento."
  ],
  power:"Na maioria das versões não há limite de corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:""
},
mazda:{level:IND, th:"mazda", rows:[["tog","Temporizador de carga",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Temporizador de carga",
  steps:[
    "Abra a app {app}, escolha o carro e entre em <b>Carregamento</b>.",
    "Abra o <b>temporizador de carga</b> (no 6e e CX-6e: <b>Carregamento agendado</b>) e ative-o.",
    "Defina {inicio}–{fim}, escolha os dias e guarde.",
    "No ecrã do carro, o mesmo está em <b>Definições › Veículo › Carregamento</b> (MX-30) ou <b>Energia › Carregamento agendado</b> (6e e CX-6e)."
  ],
  power:"Procure <b>Corrente de carga AC</b> no menu de carregamento do carro. Se não existir, ajuste-a na wallbox.",
  tip:""
},
jlr:{level:IND, th:"jlr", rows:[["tog","Carregamento fora das horas de ponta",1],["time","Início","S"],["time","Fim","E"]], title:"Definições de carregamento",
  steps:[
    "Abra a app {app} e entre em <b>Carregamento › Definições de carregamento</b>.",
    "Ative o <b>carregamento fora das horas de ponta</b>.",
    "Defina o início às {inicio} e o fim às {fim}, e guarde.",
    "Confirme no ecrã do carro."
  ],
  power:"No ecrã do carro, nas definições de carregamento, procure <b>Limite de corrente de carga</b>.",
  tip:""
},
smart:{level:IND, th:"smart", rows:[["tog","Agendamento",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Carregamento agendado",
  steps:[
    "<b>smart #1, #3 e #5:</b> abra a app {app} e entre em <b>Carregamento › Carregamento agendado</b>.",
    "Defina {inicio}–{fim}, escolha os dias e guarde.",
    "Também pode programar no ecrã central, em <b>Energia</b>.",
    "<b>EQ fortwo e forfour:</b> estes modelos só deixam definir a hora de partida. Para carregar só no vazio, use o horário da wallbox."
  ],
  power:"No ecrã central, em <b>Energia</b>, procure <b>Corrente de carga AC</b>.",
  tip:""
},
nio:{level:IND, th:"nio", rows:[["tog","Agendamento",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Carregamento agendado",
  steps:[
    "Abra a app {app} e escolha o carro.",
    "Entre em <b>Carregamento › Carregamento agendado</b>.",
    "Defina {inicio}–{fim}, escolha os dias e guarde.",
    "No ecrã central, o mesmo menu está em <b>Energia</b>."
  ],
  power:"No ecrã central, em <b>Energia</b>, procure <b>Corrente de carga AC</b>.",
  tip:""
},
xpeng:{level:IND, th:"xpeng", rows:[["tog","Reserva",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Reserva de carregamento",
  steps:[
    "Abra a app {app} e escolha o carro.",
    "Entre em <b>Carregamento › Reserva de carregamento</b>.",
    "Defina {inicio}–{fim}, escolha os dias e guarde.",
    "No ecrã central, o mesmo menu está em <b>Energia › Carregamento</b>."
  ],
  power:"No ecrã, em <b>Energia › Carregamento</b>, procure <b>Corrente de carga AC</b>.",
  tip:""
},
cn:{level:IND, th:"cn", rows:[["tog","Agendamento",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Carregamento agendado",
  steps:[
    "Abra a app {app} e escolha o carro.",
    "Entre em <b>Carregamento</b> (ou <b>Energia</b>) › <b>Carregamento agendado</b>.",
    "Defina {inicio}–{fim}, escolha os dias e guarde.",
    "Em muitos modelos, o mesmo menu também está no ecrã central."
  ],
  power:"No ecrã central, procure <b>Corrente de carga AC</b>. Se não existir, ajuste-a na wallbox.",
  tip:""
},
quad:{level:IND, th:"wb", k:"wb", rows:[["tog","Carregar só neste horário",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Horário de carregamento", single:1,
  steps:[
    "A maioria dos quadriciclos elétricos não tem carregamento agendado e começa a carregar assim que é ligada.",
    "Se o seu modelo tiver cabo <b>Tipo 2</b>, ligue-o à wallbox e programe nela o horário {inicio}–{fim}.",
    "Se carrega numa tomada, peça a um eletricista certificado que instale um <b>relógio programador</b> no quadro elétrico, no circuito dessa tomada.",
    "Se a app da marca tiver agendamento, use só esse e não acrescente outro temporizador."
  ],
  power:"A potência destes veículos é baixa e fixa. Não há nada a ajustar.",
  tip:"Nunca carregue com extensões nem com tomadas múltiplas."
},
legacy:{level:IND, th:"wb", k:"wb", rows:[["tog","Carregar só neste horário",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Horário de carregamento", single:1,
  steps:[
    "Nos modelos mais antigos, a app original pode já não funcionar.",
    "Procure no manual por <b>temporizador de carga</b>. Se existir, defina no carro o início às {inicio} e o fim às {fim}.",
    "Se não existir, programe o horário {inicio}–{fim} na wallbox. É a solução mais simples e fiável."
  ],
  power:"Estes modelos não permitem ajustar a corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:""
},
generic:{level:IND, th:"generic", rows:[["tog","Agendamento",1],["time","Início","S"],["time","Fim","E"],["days"]], title:"Carregamento agendado",
  steps:[
    "Instale a app {app} e associe o carro. Normalmente pede o número do quadro (VIN).",
    "Procure a área <b>Carregamento</b>, <b>Energia</b> ou <b>Bateria</b>.",
    "Procure <b>carregamento agendado</b>, <b>programado</b> ou <b>diferido</b> e defina {inicio}–{fim} e os dias.",
    "Se não encontrar a opção, programe o horário na wallbox."
  ],
  power:"Procure <b>Corrente de carga AC</b> no ecrã do carro. Se não existir, ajuste-a na wallbox.",
  tip:""
}
};
/* Guias simples: gera automaticamente o ecrã inicial + ecrã do horário */
Object.keys(GUIDES).forEach(k=>{
  const g=GUIDES[k]; if(g.screens) return;
  const sched={t:g.title,cap:g.title,rows:g.rows,btn:"Guardar",hl:[1,2]};
  if(g.single){g.screens=[sched]; g.map=g.steps.map(()=>0); return;}
  const home={t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"],["link","Climatização"],["link","Localização"]],hl:[1]};
  g.screens=[home,sched]; g.map=g.steps.map((s,i)=>i===0?0:1);
});


const TOP=["Tesla","BYD","Peugeot","BMW","Renault","Citroën","Mercedes-Benz","Volvo","Volkswagen","Kia","MG","XPENG"];
const ALIAS={"KGM":"SsangYong","Changan":"Deepal","GWM":"ORA Great Wall","Lynk&Co":"Lynk & Co","Mercedes-Benz":"Mercedes","Volkswagen":"VW","DS Automobiles":"DS","Smart":"Hello smart","Forthing":"Dongfeng","firefly":"NIO"};

/* ---------- Dados ---------- */
const BRANDS=[];
(function(){
  let b=null,f=null;
  RAW.split("\n").forEach(line=>{
    const l=line.trim(); if(!l) return;
    if(l[0]==="@"){const [name,guide,app]=l.slice(1).split("|"); b={name,guide,app:app||"",families:[]}; BRANDS.push(b); return;}
    if(l[0]==="#"){const [fn,fg]=l.slice(1).split(" ~"); f={name:fn.trim(),guide:(fg||"").trim(),versions:[]}; b.families.push(f); return;}
    const old=l[0]==="-", plain=l[0]==="+";
    const m=(!old&&!plain)?l.match(/^(\d+)\s+(.+)$/):null;
    const body=m?m[2]:l.slice(1);
    const [nm,note]=body.split(" ~ ");
    f.versions.push({id:m?+m[1]:null,name:nm.trim(),note:(note||"").trim(),old});
  });
  BRANDS.sort((a,c)=>a.name.localeCompare(c.name,"pt"));
  BRANDS.forEach(b=>b.families.forEach(f=>f.old=f.versions.length&&f.versions.every(v=>v.old)));
})();
/* ---------- Lojas de apps ----------
   [id Google Play, id App Store]. Sem id da App Store → abre a pesquisa da App Store.
   A loja escolhe-se pelo sistema operativo: iPhone, iPad e Mac → App Store; Android, Windows, Linux e ChromeOS → Google Play. */
const STORES={
  "myAudi":["de.myaudi.mobile.assistant","440464115"],
  "Volkswagen":["com.volkswagen.weconnect","1517566572"],
  "My BMW":["de.bmw.connected.mobile20.row","1519034860"],
  "MINI":["de.mini.connected.mobile20.row","1519459056"],
  "Ford":["com.ford.fordpass","1095418609"],
  "Tesla":["com.teslamotors.tesla","582007913"],
  "Mercedes-Benz":["com.daimler.ris.mercedesme.ece.android","1487652920"],
  "My Dacia":["com.dacia.mydacia.one.fr","1490242820"],
  "CUPRA":["com.cupra.mycupra","1576693756"],
  "MyDS":["com.psa.mym.myds","1021590964"],
  "BYD":["com.byd.bydautolink","1492400299"],
  "DENZA":["com.byd.overseas.denzalink",""],
  "MyCitroën":["com.psa.mym.mycitroen","1019563307"],
  "MyPeugeot":["com.psa.mym.mypeugeot","1021587274"],
  "My Renault":["com.renault.myrenault.one.fr","1440073013"],
  "My Alpine":["com.alpine.myalpine.one.fr","1598098658"],
  "MyŠkoda":["cz.skodaauto.myskoda","1632202810"],
  "MyMazda":["com.interrait.mymazda",""],
  "Kia":["com.kia.oneapp.eu","6740517042"],
  "MyOpel":["com.psa.mym.myopel","1439342035"],
  "myHyundai":["com.hyundai.oneapp.eu","6741947307"],
  "Volvo Cars":["se.volvo.vcc","439635293"],
  "Polestar":["com.polestar.explore","1451196635"],
  "Lexus Link+":["com.lexus.oneapp.eu","1618744308"],
  "MyToyota":["com.toyota.oneapp.eu","1617623127"],
  "My SEAT":["com.seat.myseat.ola","6472646580"],
  "FIAT":["com.fca.myconnect.fiat",""],
  "Jeep":["com.fca.myconnect",""],
  "Jaguar Remote":["com.jlr.jaguar.incontrolremote.appstore",""],
  "Land Rover Remote":["com.jlr.landrover.incontrolremote.appstore",""],
  "My Porsche":["de.porsche.one","1559529059"],
  "smart":["com.smart.hellosmart","6443878915"],
  "MG iSMART":["com.saicmotor.iov.europe",""],
  "Leapmotor":["com.leapmotorinternational.global",""],
  "My GWM":["com.gwm.eu",""],
  "ZEEKR":["com.zeekr.overseas",""],
  "XPENG":["com.xiaopeng.globalcarinfo",""],
  "NIO":["com.nio.nioapp",""],
  "My Honda+":["com.honda_eu.connected.app",""],
  "Lynk & Co":["com.lynkco.prod.lynkco_app_android",""],
  "Lotus Cars":["com.lotus.carsdomestic.intl",""],
  "Maserati Connect":["com.fca.myconnect.maseraticonnect",""],
  "Trumore":["com.togg.toggmobile",""],
  "VinFast":["com.vinfast.eu",""],
  "My Bentley":["uk.co.bentley.mybentley",""],
  "Lucid":["com.lucidmotors.mobile.prod",""],
  "MyNISSAN":["eu.nissan.nissanconnect.services","1451280347"]
};
function detectStore(){
  try{
    const n=navigator, ua=n.userAgent||"", pf=(n.userAgentData&&n.userAgentData.platform)||n.platform||"";
    if(/iPhone|iPad|iPod/i.test(ua)) return "apple";
    if(/Android/i.test(ua)||/Android/i.test(pf)) return "google";
    if(/Mac|iOS/i.test(pf)||/Macintosh|Mac OS X/i.test(ua)) return "apple";
  }catch(e){}
  return "google";
}
const STORE=typeof navigator!=="undefined"?detectStore():"google";
const STORE_NAME=STORE==="apple"?"App Store":"Google Play";
function storeUrl(app){
  const s=app&&STORES[app]; if(!s) return null;
  if(STORE==="apple") return s[1]?"https://apps.apple.com/pt/app/id"+s[1]:"https://apps.apple.com/pt/iphone/search?term="+encodeURIComponent(app);
  return s[0]?"https://play.google.com/store/apps/details?id="+s[0]+"&hl=pt_PT":"https://play.google.com/store/search?q="+encodeURIComponent(app)+"&c=apps&hl=pt_PT";
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const LOGO_SLUG={"Lynk&Co":"lynk-and-co","DS Automobiles":"ds","GWM":"great-wall","KGM":"ssangyong","e.GO Mobile":"e-go","Mercedes-Benz":"mercedes-benz"};
const logoUrl=n=>"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/"+(LOGO_SLUG[n]||norm(n).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""))+".png";
const initials=n=>n.replace(/[^A-Za-zÀ-ÿ0-9 ]/g," ").trim().split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
const PHOTO={"Abarth|500e":"e:Abarth_500e_Hatchback|1903","Abarth|600e":"e:Abarth_600e|3056","Alfa Romeo|Junior Elettrica":"w:Alfa_Romeo_Junior_(cropped).jpg","Alpine|A290":"w:Alpine_A290_GTS_–_f_15022025.jpg","Alpine|A390":"w:Alpine_A390_GT_–_f_11042026.jpg","Audi|A2 e-tron":"w:Audi_A2_e-tron_Auto_Zuerich_2026_IMG_8601.jpg","Audi|A6 e-tron":"w:Audi_A6_Avant_e-tron_–_f_18042025.jpg","Audi|e-tron GT":"w:Audi_e-tron_GT_IMG_5689.jpg","Audi|Q4 e-tron":"w:2021_Audi_Q4_e-tron_Sport_35.jpg","Audi|Q6 e-tron":"w:Audi_Q6_e-tron_DSC_7829.jpg","Audi|e-tron / Q8 e-tron":"w:2020_Audi_e-Tron_Sport_50_Quattro.jpg","Bentley|Torcal":"w:Bentley_Torcal_Auto_Zuerich_2026_IMG_8654.jpg","BMW|i3":"w:BMW_i3_50_xDrive_First_Edition_(NA0)_–_f2_20082026.jpg","BMW|i4":"w:BMW_i4_IMG_6695.jpg","BMW|i5":"w:BMW_G60_520i_1X7A2443.jpg","BMW|i7":"w:BMW_7-Series_(G70)_750e_IMG_9358.jpg","BMW|iX":"w:BMW_iX_IAA_2021_1X7A0204.jpg","BMW|iX1":"e:BMW_iX1_2022|3458","BMW|iX2":"w:BMW_U10_1X7A2456.jpg","BMW|iX3":"w:BMW_iX3_50_xDrive_M_Sportpaket_Pro_(NA5)_–_f_17052026.jpg","BMW|iX4":"w:BMW_iX4_M60_xDrive_in_der_BMW_Welt_Bild_2_2026-10-18.jpg","BMW|iX5":"w:BMW_iX5_60_xDrive_Auto_Zuerich_2026_IMG_9154.jpg","BYD|ATTO 2":"w:BYD_Atto_2_IAA_2025_DSC_2131.jpg","BYD|ATTO 3":"w:BYD_Atto_3_1X7A6491.jpg","BYD|DOLPHIN":"w:2021_BYD_Dolphin_EV_(front).jpg","BYD|DOLPHIN SURF":"e:BYD_DOLPHIN_SURF|3195","BYD|SEAL":"w:2022_BYD_Seal.jpg","BYD|SEAL U":"w:2023_BYD_Song_Plus_DM-i_(front).jpg","BYD|SEALION 7":"w:2025_BYD_Sealion_7_Performance_front.jpg","BYD|TANG":"w:BYD_Tang_DM-p_front_quarter_trimmed_2.jpg","BYD|HAN":"w:2023_BYD_Han_DM-i_(facelift),_front_8.17.23.jpg","BYD|e6":"w:2023_BYD_e6_SNF7478L_front.jpg","BYD|ETP3 (comercial)":"w:2023_BYD_ETP3.jpg","Cadillac|LYRIQ":"w:2023_Cadillac_Lyriq_in_Satin_Steel_Metallic,_front_left.jpg","Cadillac|OPTIQ":"w:2026_Cadillac_Optiq_700E4.jpg","Cadillac|VISTIQ":"w:2026_Cadillac_Vistiq_Sport_900e4_in_Stellar_Black,_front_left.jpg","Changan|Deepal S05":"w:Deepal_S05_004.jpg","Changan|Deepal S07":"w:2023_Chang'an_Shenlan_S7.jpg","Citroën|ë-C3":"w:Citroën_C3_(4th_generation)_DSC_7103_(retouched).jpg","Citroën|ë-C3 Aircross":"w:Citroën_ë-C3_Aircross_IMG_3525.jpg","Citroën|ë-C4":"w:Citroen_C4_(2020)_1X7A5851.jpg","Citroën|ë-C4 X":"w:Citroen_C4_(2020)_1X7A5851.jpg","Citroën|ë-C5 Aircross":"w:2022_Citroën_C5_Aircross_Automesse_Ludwigsburg_2024_IMG_1342.jpg","Citroën|ë-Berlingo":"w:Citroen_e-Berlingo_Auto_Zuerich_2021_IMG_0097.jpg","Citroën|ë-Jumpy Combi":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Citroën|ë-SpaceTourer":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Citroën|Ami (quadriciclo)":"w:2021_Citroen_Ami.jpg","Citroën|C-Zero":"w:Citroen_C-Zero.JPG","Citroën|ë-Méhari":"w:Citroën_E-Méhari.jpg","Citroën|ë-Berlingo Van (comercial)":"w:Citroen_e-Berlingo_Auto_Zuerich_2021_IMG_0097.jpg","Citroën|ë-Jumpy Van (comercial)":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Citroën|ë-Jumper (comercial)":"w:Fiat_e-Ducato_1X7A0350.jpg","CUPRA|Born":"w:Cupra_Born_–_f_03042026.jpg","CUPRA|Raval":"w:Cupra_Raval_VZ_IMG_6967_(cropped).jpg","CUPRA|Tavascan":"w:Cupra_Tavascan_Endurance_–_f_18042026.jpg","Dacia|Spring":"w:2023_Dacia_Spring_1X7A6327_(2).jpg","Denza|Z9GT":"w:Denza_Z9_GT_MIAS_2026_preview_01.jpg","Dongfeng|Box":"w:Nammi_01_001.jpg","DS Automobiles|DS 3 E-Tense":"w:DS_3_Crossback_PureTech_155_EAT8_So_Chic_–_f_25072020.jpg","DS Automobiles|N°4":"w:DS_4_E-Tense_(2021)_Auto_Zuerich_2021_IMG_0542.jpg","DS Automobiles|N°7":"w:DS_No_7_Auto_Zuerich_2026_IMG_8715.jpg","DS Automobiles|N°8":"w:DS_Automobiles_N°8_AWD_Long_Range_Jules_Verne_–_f_19072025.jpg","DS Automobiles|DS 3 Crossback E-Tense":"w:DS_3_Crossback_PureTech_155_EAT8_So_Chic_–_f_25072020.jpg","Elaris|BEO":"e:Elaris_BEO_2023|1975","Ferrari|Luce":"w:2027_Ferrari_Luce,_front_left.jpg","Fiat|500e":"w:Fiat-500-vorne2.jpg","Fiat|600e":"w:Fiat_600_Hybrid_1.2_T3_Pop_(III)_–_f_24032026.jpg","Fiat|Grande Panda":"w:Fiat_Grande_Panda_Elektro_La_Prima_–_f_01062025.jpg","Fiat|E-Scudo Combi":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Fiat|Topolino (quadriciclo)":"w:2021_Citroen_Ami.jpg","Fiat|E-Doblò":"w:Citroen_e-Berlingo_Auto_Zuerich_2021_IMG_0097.jpg","Fiat|E-Ducato (comercial)":"w:Fiat_e-Ducato_1X7A0350.jpg","firefly|firefly":"e:Firefly_2025|3178","Ford|Capri":"w:Ford_Capri_(2024)_Autofrühling_Ulm_2025_DSC_8721.jpg","Ford|Explorer":"w:Ford_Explorer_EV_IMG_2120.jpg","Ford|Mustang Mach-E":"w:2021_Ford_Mustang_Mach-E_Standard_Range_Front.jpg","Ford|Puma Gen-E":"e:Ford_Puma_Gen-E|3597","Ford|e-Tourneo Courier":"w:2024_Ford_Transit_Courier_Limited_-_Cactus_Grey_-_03-02-2024,_Front_Left.jpg","Ford|e-Tourneo Custom":"w:2024_Ford_Transit_Custom_Limited_TDCi_-_1996cc_2.0_(136PS)_Diesel_-_Artisan_Red_-_08-2024,_Front.jpg","Ford|e-Transit Custom Kombi":"w:2024_Ford_Transit_Custom_Limited_TDCi_-_1996cc_2.0_(136PS)_Diesel_-_Artisan_Red_-_08-2024,_Front.jpg","Ford|E-Transit (comercial)":"w:2016_Ford_Transit_350_2.2.jpg","Ford|E-Transit Courier (comercial)":"w:2024_Ford_Transit_Courier_Limited_-_Cactus_Grey_-_03-02-2024,_Front_Left.jpg","Ford|Focus Electric":"w:2012_Ford_Focus_Electric_in_Black,_front_left,_03-20-2025.jpg","GAC|AION UT":"w:Aion_UT_007.jpg","GAC|AION V":"w:GAC_Aion_V_(second_generation)_IAA_2025_DSC_1406.jpg","GAC|AION Y Plus":"w:2021_GAC_Aion_Y_(front).jpg","Geely|E2":"w:2025_Geely_Xingyuan,_front_7.28.25.jpg","Geely|E5":"w:Geely_Galaxy_E5_003_(cropped).jpg","Genesis|G80":"w:Genesis_G80_IAA_2021_1X7A0229.jpg","Genesis|GV60":"w:Genesis_GV60_1X7A5760.jpg","Genesis|GV70":"w:Genesis_GV70_IAA_2021_1X7A0228.jpg","GWM|ORA 07":"w:Ora_Lightning_Cat_004_(cropped).jpg","GWM|ORA 03 (Funky Cat)":"w:GWM_Ora_03_–_f_12102025.jpg","Honda|Super-N":"e:Honda_Super-N_2026|3656","Honda|e":"w:Honda_e_Advance_–_f_18102020.jpg","Honda|e:Ny1":"w:Honda_HR-V_eHEV_Advance_(III)_–_f_31122023.jpg","Hyundai|INSTER":"w:Hyundai_Inster_Prime_–_f_14022026.jpg","Hyundai|IONIQ 3":"w:Hyundai_Ioniq_3_Auto_Zuerich_2026_IMG_8549.jpg","Hyundai|IONIQ 5":"w:Hyundai_Ioniq_5_AWD_Techniq-Paket_–_f_31122024.jpg","Hyundai|IONIQ 6":"w:2023_Hyundai_Ioniq_6_Limited,_front_4.27.23.jpg","Hyundai|IONIQ 9":"w:Hyundai_Ioniq_9_IMG_5950.jpg","Hyundai|Kona Electric":"w:Hyundai_Kona_N_Line_(SX2)_DSC_8250.jpg","Hyundai|STARIA Electric":"w:Hyundai_Staria_1X7A0321.jpg","Hyundai|IONIQ Electric":"w:Hyundai_IONIQ_electric_Premium_–_Frontansicht,_7._Mai_2017,_Düsseldorf.jpg","JAC|E30X":"w:JAC_Yiwei_3_006.jpg","Jaecoo|5 EV":"w:2025_Jaecoo_5_1.6_Luxury_(United_Kingdom)_front_view.jpg","Jaguar|I-PACE":"w:2018_Jaguar_I-Pace_EV400_AWD_Front.jpg","Jeep|Avenger":"w:Jeep_Avenger_Elektro_Summit_–_f_18052025.jpg","Jeep|Compass Electric":"e:Jeep_Compass_2025|3684","KGM|Torres EVX":"w:KGM_Torres_Hybrid_Automesse_Ludwigsburg_2025_DSC_2567.jpg","KGM|Korando e-Motion":"w:Ssangyong_Korando_(4th_generation)_IMG_3084.jpg","Kia|EV2":"w:Kia_EV2_IMG_8443.jpg","Kia|EV3":"w:Kia_EV3_GT-Line_Automesse_Ludwigsburg_2025_DSC_2635_(cropped).jpg","Kia|EV4":"w:Kia_EV4_GT-Line_Automesse_Ludwigsburg_2025_DSC_2535.jpg","Kia|EV5":"w:2024_Kia_EV5_Earth_Exclusive_AWD_(Thailand)_front_view.png","Kia|EV6":"w:2021_Kia_EV6_GT-Line_S.jpg","Kia|EV9":"w:Kia_EV9_1X7A2472.jpg","Kia|PV5 Passenger":"w:Kia_PV5_(SW1)_Cargo_–_Seoul_Mobility_Show_2025_(07).jpg","Kia|e-Niro / Niro EV":"w:Kia_Niro_(SG2)_PHEV_Leonberg_2022_1X7A0474.jpg","Kia|e-Soul":"w:2020_Kia_Soul_First_Edition_EV_Front.jpg","Kia|Soul EV":"w:2020_Kia_Soul_First_Edition_EV_Front.jpg","Lancia|Gamma":"w:2026_Lancia_Gamma_EV_front.jpg","Lancia|Ypsilon":"w:2024_Lancia_Ypsilon_Cassina_BEV.jpg","Land Rover|Range Rover":"w:2022_Land_Rover_Range_Rover_SE_P440e_AWD_Automatic_3.0_Front.jpg","Land Rover|Range Rover Sport":"e:Land_Rover_Range_Rover_Sport_2027|3815","Leapmotor|B03X":"w:Leapmotor_B03X_Leonberg_2026_IMG_8589.jpg","Leapmotor|B05":"w:Leapmotor_Lafa_5_003.jpg","Leapmotor|B10":"w:Leapmotor_B10_Design_Pro_Max_–_f_25012026.jpg","Leapmotor|C10":"w:Leapmotor_C10_EREV_Classic-Gala_2025_DSC_0779.jpg","Leapmotor|T03":"w:2020_Leapmotor_T03_(front).jpg","Lexus|ES":"e:Lexus_ES_2026|3493","Lexus|RZ":"w:Lexus_RZ_300e_(XEBM10)_IMG_6622.jpg","Lexus|TZ":"w:Lexus_TZ550e_AWD.jpg","Lexus|UX 300e":"w:Lexus_UX_250h_IMG_2810.jpg","Lotus|Eletre":"w:Lotus_Eletre_Automesse_Ludwigsburg_2025_DSC_2658.jpg","Lotus|Emeya":"w:Lotus_Emeya_IMG_4142.jpg","Lucid|Air":"w:2022_Lucid_Air_Grand_Touring_in_Zenith_Red,_front_left.jpg","Lucid|Gravity":"w:Lucid_Gravity_Grand_Touring_GIMS_2024_1X7A2334.jpg","Lynk&Co|02":"w:Lynk_&_Co_02.jpg","Maserati|GranTurismo Folgore":"w:Maserati_GranTurismo_Trofeo_1X7A0828.jpg","Maserati|GranCabrio Folgore":"w:Maserati_GranTurismo_Trofeo_1X7A0828.jpg","Maserati|Grecale Folgore":"w:Maserati_Grecale_GT_1X7A6371.jpg","Maxus|MIFA 7":"w:Maxus_G70_003.jpg","Maxus|MIFA 9":"w:2024_LDV_MIFA_Executive_front.jpg","Maxus|eDeliver 3 (comercial)":"w:Maxus_eDeliver_3_1X7A0873.jpg","Maxus|eDeliver 5 (comercial)":"w:Maxus_eDeliver_5_IAA_Transportation_2024_(DSC02696).jpg","Maxus|eDeliver 7 (comercial)":"w:(SGP-Singapore)_Private_Maxus_eDeliver_7_GBT3557M_2024-11-06.jpg","Maxus|eDeliver 9 (comercial)":"w:Maxus_Deliver_9_1X7A0341.jpg","Maxus|eT90 (pick-up)":"w:Maxus_T90_EV_1X7A2511.jpg","Mazda|6e":"w:Mazda6e_IMG_6681.jpg","Mazda|CX-6e":"w:Mazda_EZ-60_EREV_China_2026-03-16.jpg","Mazda|MX-30":"w:2021_Mazda_MX-30_Front.jpg","Mercedes-Benz|CLA":"w:Mercedes-Benz_C118_IMG_2673.jpg","Mercedes-Benz|CLA Shooting Brake":"w:Mercedes-Benz_C118_IMG_2673.jpg","Mercedes-Benz|Classe C":"w:Mercedes-Benz_W206_IMG_6380.jpg","Mercedes-Benz|GLA":"e:Mercedes_GLA_2027|3685","Mercedes-Benz|GLB":"e:Mercedes_GLB|3788","Mercedes-Benz|GLC":"w:Mercedes-Benz_X254_1X7A6343.jpg","Mercedes-Benz|EQS":"w:Mercedes-Benz_V297_Classic-Days_2022_DSC_0016.jpg","Mercedes-Benz|Classe G":"e:Mercedes_G-Class|2192","Mercedes-Benz|AMG GT":"w:Mercedes-Benz_AMG_GT_63S_(51750035016)_(cropped).jpg","Mercedes-Benz|VLE":"w:Mercedes-Benz_VLE_-_Avant.jpg","Mercedes-Benz|eVito Tourer":"w:Mercedes-Benz_V_250_d_Exclusive_AMG_Line_Lang_(V_447)_–_Frontansicht,_29._Juni_2016,_Düsseldorf.jpg","Mercedes-Benz|EQA":"w:Mercedes-Benz_H243_IMG_5876.jpg","Mercedes-Benz|EQB":"w:Mercedes-Benz_X243_300_1X7A0422.jpg","Mercedes-Benz|EQC":"w:Mercedes-Benz_EQC_400_4MATIC_AMG_Line_(N_293)_–_f_02042021.jpg","Mercedes-Benz|EQE / EQE SUV":"w:Mercedes-Benz_V295_350+_Classic-Days_2022_DSC_0018.jpg","Mercedes-Benz|EQS SUV":"w:Mercedes-Benz_X296_1X7A1725.jpg","Mercedes-Benz|B 250 e":"w:Mercedes-Benz_B_200_CDI_Sport-Paket_(W_246)_–_Frontansicht,_21._April_2014,_Düsseldorf.jpg","Mercedes-Benz|EQV":"w:Mercedes-Benz_V_250_d_Exclusive_AMG_Line_Lang_(V_447)_–_Frontansicht,_29._Juni_2016,_Düsseldorf.jpg","Mercedes-Benz|EQT":"w:Mercedes-Benz_W420_1X7A0314.jpg","Mercedes-Benz|eCitan (comercial)":"w:Mercedes-Benz_W420_1X7A0314.jpg","Mercedes-Benz|eVito Van (comercial)":"w:Mercedes-Benz_V_250_d_Exclusive_AMG_Line_Lang_(V_447)_–_Frontansicht,_29._Juni_2016,_Düsseldorf.jpg","Mercedes-Benz|eSprinter (comercial)":"w:2019_Mercedes-Benz_Sprinter_314_CDi_2.1.jpg","MG|MG4":"w:MG4_Electric_–_f_21042025.jpg","MG|MGS5 EV":"w:MGS5_EV_Automesse_Ludwigsburg_2025_DSC_2557.jpg","MG|IM5":"w:IM_L6_GIMS_2024_1X7A2393.jpg","MG|IM6":"w:IM_LS6_008.jpg","MG|Cyberster":"w:MG_Cyberster_XPower_–_f1_01112026.jpg","MG|ZS EV":"w:MG_ZS_(crossover,_second_generation)_DSC_8542.jpg","MG|MG5":"w:Roewe_Ei5_facelift_001.jpg","MG|Marvel R":"w:Roewe_Marvel_X_IMG002_(cropped).jpg","Mini|Cooper":"w:Mini_Hatch_(J01)_Ditzingen_Mobil_IMG_9772_(cropped).jpg","Mini|Aceman":"w:Mini_Aceman_DSC_7114.jpg","Mini|Countryman":"e:Mini_Countryman_2024|3456","Mitsubishi|Eclipse Cross":"w:Mitsubishi_Eclipse_Cross_(second_generation)_Auto_Zuerich_2025_DSC_3303.jpg","Mitsubishi|i-MiEV":"w:2010_Mitsubishi_i-MiEV_(GA_MY10)_hatchback_(2015-11-11)_01.jpg","NIO|EL6":"w:(CHN-Guangdong)_Showcar_Nio_ES6_No-plate_2024-05-25.jpg","NIO|EL8":"w:(CHN-Jiangsu)_Showcar_Nio_ES8_No-plate_2025-12-20.jpg","NIO|ET5":"w:NIO_ET5_IMG_8291.jpg","NIO|ET7":"w:NIO_ET7_1X7A6679_(cropped).jpg","NIO|EL7":"w:NIO_ES7_IMG003crop.jpg","Nissan|Ariya":"w:2023_Nissan_Ariya_Advance_Front.jpg","Nissan|LEAF":"w:Nissan_Leaf_(ZE2)_autoMOBIL_Tübingen_2025_DSC_2752.jpg","Nissan|Micra":"e:Nissan_Micra_2025|3202","Nissan|Pixo":"e:Nissan_Pixo_2027|3784","Nissan|Townstar EV":"w:2024_Renault_Kangoo_in_Mineral_White,_front_left,_06-12-2025.jpg","Nissan|e-NV200":"w:2021_Nissan_NV200_Vanette.jpg","Nissan|Interstar-e (comercial)":"w:2025_Renault_Master_in_Urban_Grey,_front_right,_06-12-2025.jpg","Omoda|E5":"w:2023_Omoda_C5_front_view.png","Opel|Astra Electric":"w:Opel_Astra_1.2_Turbo_Ultimate_(L)_–_f_13122024.jpg","Opel|Combo Electric":"w:2018_Opel_Combo_life_front_quarter_right_Ruesselsheim_LWEOS1809_(cropped).jpg","Opel|Corsa Electric":"w:Opel_Corsa-e_at_IAA_2019_IMG_0738.jpg","Opel|Frontera Electric":"w:Opel_Frontera_1.2_DIT_Hybrid_Ultimate_(C)_–_f_03042026.jpg","Opel|Grandland Electric":"w:Opel_Grandland_Hybrid4_Automesse_Ludwigsburg_2022_1X7A5911.jpg","Opel|Mokka Electric":"w:Opel_Mokka-e_IMG_6111.jpg","Opel|Vivaro Combi Electric":"w:Opel_Vivaro_Combi_Facelift_front.JPG","Opel|Zafira Electric":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Opel|Ampera-e":"w:2022_Chevrolet_Bolt_EV_2LT,_NYC_official_fleet_1.2.23.jpg","Opel|Rocks Electric (quadriciclo)":"w:2021_Citroen_Ami.jpg","Opel|Vivaro Electric (comercial)":"w:Opel_Vivaro_Combi_Facelift_front.JPG","Opel|Movano Electric (comercial)":"w:Fiat_e-Ducato_1X7A0350.jpg","Peugeot|e-208":"w:Peugeot_e-208_facelift_1X7A2502.jpg","Peugeot|e-2008":"w:2023_Peugeot_2008_in_Vertigo_Blue,_front_left,_06-08-2025.jpg","Peugeot|e-308":"w:2022_-_Peugeot_308_III_(C)_-_196.jpg","Peugeot|e-3008":"w:Peugeot_e-3008_Automesse_Ludwigsburg_2024_IMG_1537.jpg","Peugeot|e-408":"w:Peugeot_408_Hybrid_136_e-DSC6_Allure_–_f_09022025.jpg","Peugeot|e-5008":"w:Peugeot_5008_C_DSC_2949.jpg","Peugeot|e-Rifter":"w:Citroën_Berlingo_XL_BlueHDi_130_EAT8_Shine_XTR_(III)_–_f_02012021.jpg","Peugeot|e-Expert Combi":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Peugeot|e-Traveller":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Peugeot|iOn":"w:2010_Mitsubishi_i-MiEV_(GA_MY10)_hatchback_(2015-11-11)_01.jpg","Peugeot|e-Partner (comercial)":"w:Citroën_Berlingo_XL_BlueHDi_130_EAT8_Shine_XTR_(III)_–_f_02012021.jpg","Peugeot|e-Expert Van (comercial)":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Peugeot|e-Boxer (comercial)":"w:Fiat_e-Ducato_1X7A0350.jpg","Polestar|2":"w:Polestar_2_–_f_02042021.jpg","Polestar|3":"w:Polestar_3_Auto_Zuerich_2023_1X7A1307.jpg","Polestar|4":"w:Polestar_4_DSC_8232_(cropped_2).jpg","Polestar|5":"w:Polestar_5_Auto_Zuerich_2025_DSC_3198.jpg","Porsche|Cayenne Electric":"w:Porsche_Cayenne_Electric_IMG_8181.jpg","Porsche|Macan Electric":"w:Porsche_Macan_Turbo_(XAB)_IMG_1762.jpg","Porsche|Taycan":"w:2020_Porsche_Taycan_4S_79kWh_Front.jpg","Porsche|Taycan Sport Turismo":"w:2020_Porsche_Taycan_4S_79kWh_Front.jpg","Porsche|Taycan Cross Turismo":"w:2020_Porsche_Taycan_4S_79kWh_Front.jpg","Renault|4 E-Tech":"w:Renault_4_E-Tech_150_Comfort_Range_Techno_–_f_22062025.jpg","Renault|5 E-Tech":"w:Renault_5_E-Tech_Electric_DSC_7279.jpg","Renault|Megane E-Tech":"w:Renault_Mégane_E-Tech_IMG_4064.jpg","Renault|Scenic E-Tech":"w:Renault_Scénic_E-Tech_IMG_9977.jpg","Renault|Twingo E-Tech":"w:Renault_Twingo_E-Tech_IMG_6605.jpg","Renault|Kangoo E-Tech":"w:2024_Renault_Kangoo_in_Mineral_White,_front_left,_06-12-2025.jpg","Renault|ZOE":"w:Renault_Zoe_R110_Z.E._50_Experience_(Facelift)_–_f_22112020.jpg","Renault|Twizy (quadriciclo)":"w:Eng_Renault_Twizy_ZE.jpg","Renault|Fluence Z.E.":"w:Renault_Fluence_Z.E._–_Frontansicht,_25._Februar_2012,_Düsseldorf.jpg","Renault|Kangoo Z.E.":"w:2024_Renault_Kangoo_in_Mineral_White,_front_left,_06-12-2025.jpg","Renault|Trafic E-Tech (comercial)":"w:2024_Renault_Trafic_LWB_Premium_front.jpg","Renault|Master E-Tech (comercial)":"w:2025_Renault_Master_in_Urban_Grey,_front_right,_06-12-2025.jpg","Rolls-Royce|Spectre":"w:2024_Rolls-Royce_Spectre_in_Midnight_Sapphire_over_Silver,_front_left.jpg","Škoda|Elroq":"w:Škoda_Elroq_DSC_9260.jpg","Škoda|Enyaq":"w:Škoda_Enyaq_IMG_1190.jpg","Škoda|Enyaq Coupe":"w:Škoda_Enyaq_IMG_1190.jpg","Škoda|Epiq":"w:Škoda_Epiq_Auto_Zuerich_2026_IMG_8960.jpg","Škoda|Peaq":"w:Škoda_Peaq_Sindelfingen_2026_IMG_8235.jpg","Škoda|Citigo e iV":"w:2013_Volkswagen_Take_UP!_1.0.jpg","Smart|1":"w:Smart_♯1_Pro_–_f_11102025.jpg","Smart|2":"w:Smart_♯2_Premium_–_f_08112026.jpg","Smart|3":"w:Smart_Hashtag_3_DSC_7992.jpg","Smart|5":"w:Smart_Hashtag_5_Premium_autoMOBIL_Tübingen_2025_DSC_2755_(cropped).jpg","Smart|EQ fortwo / forfour":"w:2016_Smart_Fortwo_Passion_Automatic_1.0_Front.jpg","Smart|fortwo electric drive":"w:2016_Smart_Fortwo_Passion_Automatic_1.0_Front.jpg","Subaru|E-Outback":"e:Subaru_E-Outback_2026|3506","Subaru|Solterra":"w:Subaru_Solterra_1X7A1840.jpg","Subaru|Uncharted":"w:Subaru_Uncharted_IMG_6871.jpg","Suzuki|e VITARA":"w:Suzuki_e_Vitara_in_Hamamatsu_Sta_front.jpg","Tesla|Model 3":"w:Tesla_Model_3_(2023)_Autofrühling_Ulm_IMG_9282.jpg","Tesla|Model Y":"w:Tesla_Model_Y_Premium_(Facelift)_–_f_05052026.jpg","Tesla|Model S":"w:Tesla_Model_S_(Facelift_ab_04-2016)_(cropped).jpg","Tesla|Model X":"w:2017_Tesla_Model_X_100D_Front.jpg","TOGG|T10F":"w:Togg_T10F_IAA_2025_DSC_1904.jpg","TOGG|T10X":"w:Togg_T10X_Grey.jpg","Toyota|bZ4X":"w:Toyota_bZ4X_Automesse_Ludwigsburg_2022_1X7A5895.jpg","Toyota|C-HR+":"w:Toyota_C-HR+_Teamplayer_–_f_05042026.jpg","Toyota|Urban Cruiser":"e:Toyota_Urban_Cruiser|3208","Toyota|Proace City Verso":"w:Citroën_Berlingo_XL_BlueHDi_130_EAT8_Shine_XTR_(III)_–_f_02012021.jpg","Toyota|Proace Verso":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Toyota|Proace City Electric (comercial)":"w:Citroën_Berlingo_XL_BlueHDi_130_EAT8_Shine_XTR_(III)_–_f_02012021.jpg","Toyota|Proace Electric (comercial)":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Toyota|Proace Max Electric (comercial)":"w:Fiat_e-Ducato_1X7A0350.jpg","VinFast|VF 6":"w:VinFast_VF_6_DSC_8468.jpg","VinFast|VF 8":"w:VinFast_VF_8_DSC_8568.jpg","Volkswagen|ID.3":"w:2020_Volkswagen_ID.3_1st_Front.jpg","Volkswagen|ID.4":"w:2025_Volkswagen_ID4_Pro_Redspot_front.jpg","Volkswagen|ID.5":"w:Volkswagen_ID.5_Leonberg_2022_1X7A0459.jpg","Volkswagen|ID.7":"w:Volkswagen_ID.7_DSC_7879_(cropped).jpg","Volkswagen|ID.7 Tourer":"w:Volkswagen_ID.7_DSC_7879_(cropped).jpg","Volkswagen|ID. Polo":"w:Volkswagen_ID.Polo_IMG_8361.jpg","Volkswagen|ID. Cross":"w:Volkswagen_ID._Cross_Auto_Zuerich_2026_IMG_8599.jpg","Volkswagen|ID. Tiguan":"w:Volkswagen_ID.Tiguan_Auto_Zuerich_2026_IMG_8986.jpg","Volkswagen|ID. Buzz":"w:Volkswagen_ID._Buzz_1X7A6263.jpg","Volkswagen|e-Transporter Kombi":"w:Volkswagen_T7_Transporter_DSC_9339.jpg","Volkswagen|e-Caravelle":"w:Volkswagen_T7_Transporter_DSC_9339.jpg","Volkswagen|e-Golf":"w:2013_Volkswagen_Golf_SE_BlueMotion_Technology_1.4_Front.jpg","Volkswagen|e-up!":"w:2013_Volkswagen_Take_UP!_1.0.jpg","Volkswagen|ID. Buzz Cargo (comercial)":"w:Volkswagen_ID._Buzz_1X7A6263.jpg","Volkswagen|e-Crafter (comercial)":"w:2017_Volkswagen_Crafter_CR35_Trendline_TD_2.0_Front.jpg","Volvo|EX30":"w:Volvo_EX30_IMG_8923.jpg","Volvo|EX40 (antigo XC40 Recharge)":"w:2019_Volvo_XC40_T5_Momentum_in_Bright_Silver_Metallic,_front_left,_2025-09-22.jpg","Volvo|EC40 (antigo C40 Recharge)":"w:Volvo_C40_DSC_7985.jpg","Volvo|EX60":"w:Volvo_EX60_Auto_Zuerich_2026_IMG_9058.jpg","Volvo|EX90":"w:Volvo_EX90_autoMOBIL_Tübingen_2025_DSC_2740.jpg","Volvo|ES90":"w:Volvo_ES90_Ultra_–_f_29032026.jpg","Voyah|Courage":"w:Voyah_Courage_005.jpg","Voyah|Dream":"w:2021_Voyah_Dreamer_(front).jpg","Voyah|Free":"w:(CHN-Shanghai)_Showcar_Voyah_Free+_No-plate_2025-12-21.jpg","XPENG|G6":"w:XPeng_G6_018_(cropped).jpg","XPENG|G9":"w:2022_XPeng_G9_(front).jpg","XPENG|G9L":"w:XPeng_G9_Performance_IMG_9722.jpg","XPENG|L03":"w:(CHN-Hubei)_Showcar_XPeng_Mona_M03_No-plate_2024-12-03.jpg","XPENG|P7+":"w:XPeng_P7+_IAA_2025_DSC_2059_(cropped).jpg","XPENG|X9":"w:XPeng_X9_003_(cropped).jpg","XPENG|P7":"w:XPeng_P7_II_MY2025_IMG03.jpg","XPENG|G3":"w:Xpeng_G3i_001.jpg","Zeekr|001":"w:2022_Zeekr_001_(front).jpg","Zeekr|7GT":"w:Zeekr_007_006_(cropped).jpg","Zeekr|7X":"w:Zeekr_7X_005_(cropped).jpg","Zeekr|X":"w:2023_Zeekr_X_(front).jpg","Aiways|U5":"w:Aiways_U5_IMG_4448.jpg","Aiways|U6":"w:Aiways_U6_Auto_Zuerich_2023_1X7A1153.jpg","e.GO Mobile|Life":"w:E.Go_Life_Genf_2019_1Y7A5161.jpg","Fisker|Ocean":"w:Fisker_Ocean_Motorworld_Munich_1X7A0079.jpg","Forthing|Friday":"w:Forthing_Friday_EV_IAA_2023_1X7A0251.jpg","Hongqi|E-HS9":"w:Hongqi_E-HS9_IMG_0753_(cropped).jpg","Hongqi|EH7":"w:Hongqi_EH7_01_China_2025-03-31.jpg","Hongqi|EHS7":"w:Hongqi_Tiangong_08_001.jpg","Seres|3":"w:Dongfeng_Fengon_500_Shishi_01_2022-11-04.jpg","Seres|5":"w:Seres_SF5_004.jpg","Skywell|ET5":"w:2022_Skyworth_EV6_(front).jpg","Farizon|SuperVAN (comercial)":"w:Farizon_SV_004.jpg","SEAT|Mii electric":"w:2013_Volkswagen_Take_UP!_1.0.jpg","Iveco|eDaily (comercial)":"w:2014_Iveco_Daily_35_S13_MWB_2.3.jpg","Microlino|Microlino (quadriciclo)":"w:Micro_Microlino_Pioneer_Series_Rasant_Automobilmesse_Metzingen_2024_IMG_2235.jpg","Silence|S04 Nanocar (quadriciclo)":"w:Silence_S04_Automesse_Ludwigsburg_2024_IMG_1677.jpg","Mobilize|Duo (quadriciclo)":"w:Mobilize_Duo_Auto_Zuerich_2024_DSC_6426.jpg","Mobilize|Bento (quadriciclo comercial)":"w:Mobilize_Duo_Auto_Zuerich_2024_DSC_6426.jpg","Aixam|e-City / e-Coupé (quadriciclo)":"w:City_premium_voiture_sans_permis_aixam_pour_Wikipedia_(cropped).jpg","Ligier|Myli (quadriciclo)":"w:Ligier_Myli_2023_front.jpg","XEV|YoYo (quadriciclo)":"w:XEV_Yoyo_IAA_2021_1X7A0240.jpg","Bolloré|Bluecar":"w:Paris_Autolib_06_2012_Bluecar_2907.JPG","Cenntro|Logistar (comercial)":"w:Cenntro_Logistar,_Nagymező_Straße,_2024_Terézváros.jpg","Estrima|Birò (quadriciclo)":"w:Matteo_Maestri_e_Birò.jpg","Goupil|G4 (comercial)":"w:Goupil_G4_IAA_Transportation_2026_(DSC7713).jpg","Goupil|G6 (comercial)":"w:Goupil_G6.jpg","Tazzari|Zero":"w:Girona_048.JPG","Think|City":"w:Think_City_2007.jpg"};
function photoFor(b,f){
  const p=PHOTO[b.name+"|"+f.name]; if(!p) return null;
  const k=p.slice(0,1), val=p.slice(2);
  if(k==="w") return {src:"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(val)+"?width=480",credit:"Foto: Wikimedia Commons",href:"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(val)};
  const [folder,id]=val.split("|"); const v=f.versions.find(x=>x.id===+id)||f.versions.find(x=>x.id);
  return {src:"https://ev-database.org/img/auto/"+folder+"/"+folder+"-01.jpg",credit:"Foto: EV Database",href:v?evUrl(b,v):"https://ev-database.org/"};
}
const CAR_SVG='<svg viewBox="0 0 120 50" aria-hidden="true"><path d="M8 36c0-6 4-9 10-10l14-3 14-10c3-2 6-3 10-3h22c5 0 9 2 12 5l9 9 10 2c5 1 8 4 8 9v4c0 2-1 3-3 3h-6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 42h40M8 36v3c0 2 1 3 3 3h5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="28" cy="42" r="7" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="92" cy="42" r="7" fill="none" stroke="currentColor" stroke-width="3"/></svg>';
function evUrl(b,v){return "https://ev-database.org/car/"+v.id+"/"+(b.name+" "+v.name).replace(/\+/g,"plus").replace(/[°&#.]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ /g,"-");}

/* ===================== 2. Ilustrações do telemóvel ===================== */
const DEVICE_CSS = `.gm svg,.gm img{display:inline-block;vertical-align:middle;max-width:none}
.gm img{height:auto}
.gm .dev{--hlc:#40DDA6;--px:12px;font-family:var(--ff);text-align:left;margin:0 auto;-webkit-font-smoothing:antialiased}
.gm .dev *{box-sizing:border-box}
.gm .dev svg{flex:none}
.gm .dev.phone{width:272px;max-width:100%;background:#0A0A0A;border-radius:42px;padding:8px;box-shadow:0 18px 40px rgba(23,20,36,.22)}
.gm .dev .scr{position:relative;background:var(--bg);color:var(--fg);border-radius:34px;overflow:hidden;height:540px;display:flex;flex-direction:column;font-size:12.5px;line-height:1.3}
.gm .m-top{flex:none;color:var(--fg)}
.gm .band .m-top{background:var(--hd);color:var(--hdfg)}
.gm .m-sb{display:flex;justify-content:space-between;align-items:center;height:34px;padding:0 20px 0 26px;font:600 11px/1 -apple-system,"SF Pro Text",Inter,Roboto,Arial,sans-serif}
.gm .m-sb>span:first-child,.gm .m-ic{width:54px}
.gm .m-ic{display:flex;justify-content:flex-end;gap:4px;align-items:center}
.gm .m-ic svg{height:9px;width:auto;fill:currentColor}
.gm .isl{width:74px;height:22px;background:#000;border-radius:999px}
.gm .m-nav{position:relative;display:flex;align-items:center;flex-wrap:wrap;gap:2px 6px;padding:4px 14px 10px;min-height:42px}
.gm .m-nav b{flex:1;min-width:0;font-family:var(--hf);font-weight:var(--tw);font-size:15px;line-height:1.2}
.gm .m-back{width:24px;height:24px;display:flex;align-items:center;justify-content:center;margin-left:-6px}
.gm .m-back svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.gm .hd-c .m-nav{justify-content:center;text-align:center;padding-left:44px;padding-right:44px}
.gm .hd-c .m-back{position:absolute;left:14px;top:7px;margin:0}
.gm .hd-L .m-nav b{flex-basis:100%;font-size:22px;line-height:1.15;letter-spacing:-.01em;margin-top:2px}
.gm .hd-L .m-nav{padding-bottom:12px}
.gm .up .m-nav b{text-transform:uppercase;letter-spacing:.06em;font-size:13px}
.gm .up.hd-L .m-nav b{font-size:17px}
.gm .band .m-nav{padding-bottom:12px}
.gm .m-body{flex:1;min-height:0;overflow:hidden;padding:6px var(--px) 12px;display:flex;flex-direction:column;gap:10px}
.gm .band .m-body{padding-top:12px}
.gm .l-flat{--px:10px}
.gm .m-grp{display:flex;flex-direction:column}
.gm .m-row{position:relative;display:flex;align-items:center;gap:10px;min-height:44px;padding:10px 12px;min-width:0}
.gm .l-card .m-grp{background:var(--card);border-radius:var(--r)}
.gm .l-card .m-row+.m-row{border-top:1px solid var(--line)}
.gm .l-card .m-row:first-child{border-radius:var(--r) var(--r) 0 0}
.gm .l-card .m-row:last-child{border-radius:0 0 var(--r) var(--r)}
.gm .l-card .m-row:only-child{border-radius:var(--r)}
.gm .l-sep .m-grp{gap:8px}
.gm .l-sep .m-row{background:var(--card);border-radius:var(--r)}
.gm .light.l-sep .m-row,.gm .light.l-sep .m-tile,.gm .light .m-pc{box-shadow:0 1px 2px rgba(16,24,40,.06)}
.gm .l-flat .m-row{border-bottom:1px solid var(--line);padding:12px 8px}
.gm .l-flat .m-grp{border-top:1px solid var(--line)}
.gm .m-l{flex:1;min-width:0;overflow-wrap:anywhere}
.gm .m-l small{display:block;color:var(--mut);font-size:11px;margin-top:2px}
.gm .m-li{width:30px;height:30px;border-radius:var(--rs);background:var(--chip);display:flex;align-items:center;justify-content:center;color:var(--acct)}
.gm .l-flat .m-li{background:transparent;width:22px;margin-right:2px;color:var(--fg)}
.gm .m-li svg,.gm .m-tile svg,.gm .h-q svg,.gm .m-tabs svg,.gm .h-sub svg,.gm .h-pill svg,.gm .bt-s svg,.gm .m-fld svg,.gm .m-warn svg{stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.gm .m-li svg{width:17px;height:17px}
.gm .m-chev{display:flex;color:var(--mut)}
.gm .m-chev svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.gm .m-v{flex:none;font-weight:600;color:var(--mut)}
.gm .m-note{color:var(--mut);font-size:11px;line-height:1.4}
.gm .m-nt{min-height:0}
.gm .m-sect{font-size:10.5px;font-weight:700;color:var(--mut);text-transform:uppercase;letter-spacing:.07em;padding:4px 2px 0;margin-bottom:-4px}
.gm .dev .hl{outline:2px solid var(--hlc);outline-offset:-2px;background-image:linear-gradient(rgba(64,221,166,.16),rgba(64,221,166,.16))}
.gm .l-flat .m-row.hl{border-radius:6px}
.gm .dev.spot .m-grp>:not(.hl),.gm .dev.spot .m-pair>:not(.hl),.gm .dev.spot .m-tl>:not(.hl){opacity:.42}
.gm .m-sw{flex:none;position:relative;width:38px;height:23px;border-radius:999px;background:var(--line)}
.gm .m-sw i{position:absolute;top:2px;left:2px;width:19px;height:19px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.3)}
.gm .m-sw.on{background:var(--acc)}
.gm .m-sw.on i{left:17px;background:var(--on)}
.gm .sw-ios .m-sw.on i{background:#fff}
.gm .sw-ios.sk-mini .m-sw.on i,.gm .sw-ios.sk-smart .m-sw.on i{background:#000}
.gm .sw-md .m-sw{width:40px;height:24px;background:transparent;border:2px solid var(--mut)}
.gm .sw-md .m-sw i{top:4px;left:4px;width:12px;height:12px;background:var(--mut);box-shadow:none}
.gm .sw-md .m-sw.on{background:var(--acc);border-color:var(--acc)}
.gm .sw-md .m-sw.on i{top:2px;left:18px;width:16px;height:16px;background:var(--on)}
.gm .sw-sq .m-sw{width:40px;height:22px;border-radius:3px}
.gm .sw-sq .m-sw i{width:18px;height:18px;border-radius:2px;box-shadow:none}
.gm .sw-sq .m-sw.on i{left:20px}
.gm .m-time{flex:none;font-weight:600;font-size:14px;font-variant-numeric:tabular-nums}
.gm .tm-chip .m-time{background:var(--chip);padding:5px 10px;border-radius:var(--rs)}
.gm .tm-plain .m-time{color:var(--acct);font-weight:500;font-size:15px}
.gm .m-pair{display:flex;gap:8px}
.gm .m-pc{position:relative;flex:1;min-width:0;background:var(--card);border-radius:var(--r);padding:10px 12px}
.gm .l-flat .m-pc{background:transparent;border:1px solid var(--line)}
.gm .m-pc small{display:block;color:var(--mut);font-size:11px}
.gm .m-pc b{display:block;font-size:24px;font-weight:600;letter-spacing:-.01em;font-variant-numeric:tabular-nums;margin-top:2px}
.gm .m-fld{position:relative;flex:1;min-width:0;display:flex;align-items:center;justify-content:space-between;gap:6px;border:1px solid var(--mut);border-radius:var(--rs);padding:14px 10px 9px;margin-top:6px}
.gm .m-fld small{position:absolute;top:-7px;left:8px;padding:0 4px;background:var(--bg);color:var(--mut);font-size:10px;line-height:12px}
.gm .m-fld b{font-size:16px;font-weight:600;font-variant-numeric:tabular-nums}
.gm .m-fld svg{width:16px;height:16px;color:var(--mut)}
.gm .m-dw{justify-content:center}
.gm .m-days{display:flex;justify-content:space-between;width:100%;gap:3px}
.gm .m-days i{font-style:normal;flex:none;width:25px;height:25px;display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:700;line-height:1;border-radius:50%;background:var(--chip);color:var(--mut)}
.gm .m-days i.on{background:var(--acc);color:var(--on)}
.gm .dy-pill .m-days i{flex:1;width:auto;border-radius:999px;height:24px}
.gm .dy-square .m-days i{border-radius:3px}
.gm .dy-ring .m-days i{background:transparent;border:1.5px solid var(--line)}
.gm .dy-ring .m-days i.on{background:transparent;border-color:var(--acc);color:var(--acct)}
.gm .dy-text .m-days i{position:relative;background:transparent}
.gm .dy-text .m-days i.on{background:transparent;color:var(--acct)}
.gm .dy-text .m-days i.on::after{content:"";position:absolute;bottom:0;left:50%;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:var(--acct)}
.gm .m-sgw{padding:6px}
.gm .m-seg{display:flex;width:100%;background:var(--chip);border-radius:var(--rs);padding:2px}
.gm .m-seg>span{flex:1;min-width:0;text-align:center;padding:6px 2px;font-size:11px;border-radius:var(--rs);color:var(--mut)}
.gm .m-seg>span.on{background:var(--acc);color:var(--on);font-weight:700}
.gm .sg-line .m-seg{background:transparent;padding:0;border-radius:0;border-bottom:1px solid var(--line)}
.gm .sg-line .m-seg>span{border-radius:0;padding:8px 2px 6px;border-bottom:2px solid transparent;margin-bottom:-1px}
.gm .sg-line .m-seg>span.on{background:transparent;color:var(--fg);border-bottom-color:var(--acct)}
.gm .m-rad{flex:none;position:relative;width:18px;height:18px;border-radius:50%;border:2px solid var(--mut)}
.gm .m-rad.on{border-color:var(--acct)}
.gm .m-rad.on::after{content:"";position:absolute;top:3px;left:3px;width:8px;height:8px;border-radius:50%;background:var(--acct)}
.gm .m-col{flex-direction:column;align-items:stretch;gap:10px}
.gm .m-sl-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.gm .m-sl{position:relative;display:block;height:4px;border-radius:2px;background:var(--line);margin:4px 8px 6px}
.gm .m-sl i{position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--acct)}
.gm .m-sl em{position:absolute;top:50%;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#fff;border:2px solid var(--acct)}
.gm .m-batt{padding:2px 2px 4px}
.gm .bt-h{display:flex;align-items:baseline;gap:8px}
.gm .bt-h b{white-space:nowrap;font-size:30px;font-weight:600;letter-spacing:-.02em;line-height:1.1}
.gm .bt-h small{color:var(--mut);font-size:12px}
.gm .bt-s{display:flex;align-items:center;gap:4px;color:var(--mut);font-size:11px}
.gm .bt-s svg{width:12px;height:12px;color:var(--ringc)}
.gm .bt-b{display:block;height:8px;border-radius:4px;background:var(--line);overflow:hidden;margin:8px 0 7px}
.gm .bt-b i,.gm .bt-c i{display:block;height:100%;background:#34C759;border-radius:inherit}
.gm .bt-c{position:relative;display:block;height:28px;border:2px solid var(--mut);border-radius:7px;padding:3px;margin:8px 8px 8px 0}
.gm .bt-c::after{content:"";position:absolute;right:-6px;top:7px;width:3px;height:10px;border-radius:0 2px 2px 0;background:var(--mut)}
.gm .bt-c i{border-radius:3px}
.gm .bt-c em{position:absolute;top:-5px;bottom:-5px;width:0;border-left:2px dotted var(--fg)}
.gm .b-ring{display:flex;align-items:center;gap:14px}
.gm .b-ring>div{flex:1;min-width:0}
.gm .b-ring>div b{white-space:nowrap}
.gm .b-ring>div b{display:block;font-size:18px;font-weight:700}
.gm .b-ring>div small{display:block;color:var(--mut);font-size:11px;margin-top:2px}
.gm .b-ring .bt-s{margin-top:6px}
.gm .m-rg{position:relative;flex:none;width:78px;height:78px}
.gm .m-rg svg{display:block;width:100%;height:100%}
.gm .m-rg .rt{stroke:var(--line)}
.gm .m-rg .rf{stroke:var(--ringc)}
.gm .m-rg .rv{fill:var(--fg);font-family:var(--ff);font-size:15px;font-weight:700}
.gm .hero{display:flex;flex-direction:column;gap:6px;min-width:0}
.gm .h-name{font-family:var(--hf);font-weight:var(--tw);font-size:20px;line-height:1.15;letter-spacing:-.01em;overflow-wrap:break-word;min-width:0}
.gm .up .h-name{text-transform:uppercase;letter-spacing:.05em;font-size:16px}
.gm .h-sub{display:flex;align-items:center;gap:5px;color:var(--mut);font-size:11.5px}
.gm .h-sub svg{width:13px;height:13px}
.gm .h-img{height:112px;overflow:hidden;border-radius:var(--r);display:flex;align-items:center;justify-content:center;background:var(--card)}
.gm .h-img img{display:block;width:100%;height:100%;object-fit:cover}
.gm .h-img>svg{width:150px;color:var(--mut)}
.gm .h-tesla{gap:3px;padding-top:4px}
.gm .h-tesla .h-name{font-size:26px;font-weight:500}
.gm .h-tesla .h-img{margin:8px calc(-1*var(--px)) 6px;height:124px;border-radius:0}
.gm .h-bmw .h-name{font-size:22px}
.gm .h-bmw .h-img{height:116px;margin-top:4px}
.gm .h-stat,.gm .h-kpi{display:flex;gap:8px}
.gm .h-stat>div,.gm .h-kpi>div{flex:1;min-width:0;background:var(--card);border-radius:var(--r);padding:8px 10px}
.gm .h-stat b{display:block;font-size:15px}
.gm .h-stat small,.gm .h-kpi em{display:block;color:var(--mut);font-size:10.5px;font-style:normal}
.gm .h-kpi b{display:block;font-size:22px;font-weight:700;line-height:1.1}
.gm .h-kpi b small{font-size:11px;margin-left:2px;font-weight:600}
.gm .h-band{padding:2px 16px 14px;gap:3px}
.gm .h-band .h-sub{color:inherit;opacity:.78}
.gm .h-band .h-img{height:112px;margin-top:8px;background:rgba(127,127,127,.12)}
.gm .h-ring{align-items:center;text-align:center}
.gm .h-ring .h-img,.gm .h-ring .h-name{width:100%}
.gm .h-ring .h-img{margin-top:2px}
.gm .h-rw{display:flex;align-items:center;gap:12px;text-align:left}
.gm .h-rw .m-rg{width:58px;height:58px}
.gm .h-rw>div{flex:none}
.gm .h-rw>div b{display:block;font-size:16px;white-space:nowrap}
.gm .h-rw>div small{color:var(--mut);font-size:11px}
.gm .h-min{gap:4px}
.gm .h-min .h-img{margin:-6px calc(-1*var(--px)) 8px;height:138px;border-radius:0}
.gm .h-min .h-name{font-size:22px}
.gm .up .h-min .h-name{font-size:17px}
.gm .h-bar{display:block;height:3px;background:var(--line);margin:4px 0 2px}
.gm .h-bar i{display:block;height:100%;background:var(--fg)}
.gm .h-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.gm .h-top .h-name{flex:1}
.gm .h-pill{flex:none;display:flex;align-items:center;gap:4px;font-size:10.5px;padding:4px 8px;border-radius:999px;background:var(--chip);color:var(--mut)}
.gm .h-pill svg{width:12px;height:12px}
.gm .h-q{display:flex;justify-content:space-between;gap:6px;margin-top:4px}
.gm .h-q>span{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10px;color:var(--mut)}
.gm .h-q i{width:42px;height:42px;border-radius:50%;background:var(--card);display:flex;align-items:center;justify-content:center;color:var(--fg)}
.gm .h-q em{font-style:normal}
.gm .q-sq i{width:100%;height:36px;border-radius:var(--rs)}
.gm .h-q svg{width:18px;height:18px}
.gm .m-tl{display:flex;flex-wrap:wrap;gap:8px}
.gm .m-tile{position:relative;width:calc(50% - 4px);min-width:0;background:var(--card);border-radius:var(--r);padding:11px 12px;display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:600;overflow-wrap:anywhere}
.gm .m-tile:last-child:nth-child(odd){width:100%}
.gm .m-tile small{display:block;font-weight:400;color:var(--mut);font-size:10.5px;margin-top:2px}
.gm .m-tile svg{width:20px;height:20px;color:var(--acct)}
.gm .m-tabs{flex:none;display:flex;justify-content:space-around;padding:4px 6px 20px;border-top:1px solid var(--line);background:var(--bg)}
.gm .m-tabs>span{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:1px;color:var(--mut);font-size:9.5px;padding-top:4px;border-top:2px solid transparent;margin-top:-1px}
.gm .m-tabs i{display:flex;align-items:center;justify-content:center;width:44px;height:24px;border-radius:999px}
.gm .m-tabs svg{width:19px;height:19px}
.gm .m-tabs em{font-style:normal;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.gm .m-tabs.nol em{display:none}
.gm .m-tabs.nol>span{padding-top:8px}
.gm .m-tabs>span.on{color:var(--acct)}
.gm .dark .m-tabs>span.on{color:var(--fg)}
.gm .ind-pill .m-tabs>span.on i{background:var(--pill)}
.gm .ind-bar .m-tabs>span.on{border-top-color:var(--acct)}
.gm .dark.ind-bar .m-tabs>span.on{border-top-color:var(--fg)}
.gm .m-btn{flex:none;margin:8px var(--px) 24px;padding:12px;text-align:center;border-radius:var(--br);background:var(--acc);color:var(--on);font-weight:700;font-size:13px}
.gm .bt-outline .m-btn{background:transparent;border:1.5px solid var(--acct);color:var(--acct)}
.gm .bt-full .m-btn{margin:0;border-radius:0;padding:14px 12px 30px}
.gm .up .m-btn{text-transform:uppercase;letter-spacing:.08em;font-size:12px}
.gm .m-warn{display:flex;gap:8px;align-items:flex-start;background:rgba(255,176,0,.14);color:#7A4B00;border-radius:var(--rs);padding:10px;font-size:11px;line-height:1.4}
.gm .dark .m-warn{color:#FFD27A}
.gm .m-warn svg{width:15px;height:15px;margin-top:1px}
.gm .m-hi{position:absolute;bottom:7px;left:50%;width:92px;height:4px;margin-left:-46px;border-radius:2px;background:var(--fg);opacity:.85}
.gm .bt-full.has-btn .m-hi{background:var(--on)}
.gm .is-home:not(.has-tabs) .m-body{padding-bottom:26px}
.gm .dev .scr{height:540px}
@media (max-width:360px){.gm .dev.phone{width:100%}}
`;

let MS={screen:0,family:null,photo:null};
const IC={home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  grid:'<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',fan:'<circle cx="12" cy="12" r="2"/><path d="M12 10c0-4 1-7 4-7s3 4-4 7M14 12c4 0 7 1 7 4s-4 3-7-4M12 14c0 4-1 7-4 7s-3-4 4-7M10 12c-4 0-7-1-7-4s4-3 7 4"/>',
  nav:'<path d="m3 11 18-8-8 18-2-8z"/>',music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',phone:'<path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2"/>',
  route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8"/>',wrench:'<path d="M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3z"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',pin:'<path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2"/>',
  light:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',car:'<path d="M3 16v-4l2-5h14l2 5v4H3z"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/>',
  check:'<path d="m5 12 4 4 10-10"/>',more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  chev:'<path d="m9 6 6 6-6 6"/>',back:'<path d="m15 5-7 7 7 7"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  shield:'<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z"/>'};
const svg=(k,c)=>'<svg'+(c?' class="'+c+'"':'')+' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[k]+'</svg>';
function iconKey(l){const n=norm(l);return /carreg|eletric|energia|bateria/.test(n)?"bolt":/clima|ar cond/.test(n)?"fan":/naveg/.test(n)?"nav":/media|music/.test(n)?"music":/defin/.test(n)?"gear":/telef/.test(n)?"phone":/trajet|viage/.test(n)?"route":/manut|servic/.test(n)?"wrench":/tranc|control/.test(n)?"lock":/estado|seguran/.test(n)?"shield":/veicul|carro/.test(n)?"car":"pin";}
function icon(l){return svg(iconKey(l));}
const DAYS=["S","T","Q","Q","S","S","D"];
const QUICK=[["lock","Trancar"],["fan","Clima"],["light","Luzes"],["pin","Localizar"]];
const TAB_IC={"Início":"home","Estado":"car","Carro":"car","Veículo":"car","Mapa":"pin","Serviços":"wrench","Perfil":"user","Conta":"user","Eu":"user","Carregar":"bolt","Loja":"grid","Controlo":"lock","Remoto":"lock","Mais":"more","Menu":"more","Explorar":"route"};
const TAB_DEF=["Início","Mapa","Carregar","Serviços","Perfil"];
const fillT=(t,p)=>String(t).replace(/\{inicio\}/g,p.s).replace(/\{fim\}/g,p.e);
/* cores auxiliares */
function hexRgb(h){h=h.replace("#",""); if(h.length===3) h=h.split("").map(c=>c+c).join(""); return [0,2,4].map(i=>parseInt(h.substr(i,2),16));}
function lum(h){return hexRgb(h).map(v=>{v/=255; return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);}
function contrast(a,b){const x=lum(a),y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
const rgba=(h,a)=>"rgba("+hexRgb(h).join(",")+","+a+")";
function carImg(){return MS.photo?'<img src="'+esc(MS.photo.src)+'" alt="">':CAR_SVG;}
function ringHTML(p){const c=2*Math.PI*26; return '<span class="m-rg"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" fill="none" stroke-width="6" class="rt" style="stroke:var(--line)"/><circle cx="32" cy="32" r="26" fill="none" stroke-width="6" stroke-linecap="round" class="rf" style="stroke:var(--ringc)" stroke-dasharray="'+(c*p/100).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle" class="rv" style="fill:var(--fg)">'+p+'%</text></svg></span>';}
function battHTML(p,K){
  const plug='<small class="bt-s">'+svg("bolt")+'Cabo ligado · à espera do horário</small>';
  if(K.batt==="ring") return '<div class="m-batt b-ring">'+ringHTML(p)+'<div><b>280 km</b><small>Autonomia estimada</small>'+plug+'</div></div>';
  if(K.batt==="cell") return '<div class="m-batt b-cell"><div class="bt-h"><b>'+p+' %</b><small>280 km</small></div><span class="bt-c"><i style="width:'+p+'%"></i><em style="left:80%"></em></span>'+plug+'</div>';
  return '<div class="m-batt b-bar"><div class="bt-h"><b>'+p+' %</b><small>280 km</small></div><span class="bt-b"><i style="width:'+p+'%"></i></span>'+plug+'</div>';
}
function heroHTML(K,name){
  const img='<div class="h-img">'+carImg()+'</div>';
  const quick=K.quick?'<div class="h-q q-'+K.quick+'">'+QUICK.map(q=>'<span><i>'+svg(q[0])+'</i>'+(K.quick!=="round"?'<em>'+q[1]+'</em>':'')+'</span>').join("")+'</div>':"";
  const nm='<div class="h-name">'+esc(name)+'</div>';
  switch(K.home){
    case "tesla": return '<div class="hero h-tesla">'+nm+'<div class="h-sub">'+svg("bolt")+'280 km · Estacionado</div>'+img+quick+'</div>';
    case "bmw": return '<div class="hero h-bmw">'+nm+'<div class="h-sub">'+svg("lock")+'Trancado · atualizado agora</div>'+img+'<div class="h-stat"><div><b>62 %</b><small>Bateria</small></div><div><b>280 km</b><small>Autonomia</small></div></div>'+quick+'</div>';
    case "band": return '<div class="hero h-band">'+nm+'<div class="h-sub">62 % · 280 km · Cabo ligado</div>'+img+'</div>';
    case "ring": return '<div class="hero h-ring">'+nm+img+'<div class="h-rw">'+ringHTML(62)+'<div><b>280 km</b><small>Cabo ligado</small></div></div></div>';
    case "min": return '<div class="hero h-min">'+img+nm+'<div class="h-sub">62 % · 280 km · Cabo ligado</div><span class="h-bar"><i style="width:62%"></i></span></div>';
    default: return '<div class="hero h-dash"><div class="h-top">'+nm+'<span class="h-pill">'+svg("lock")+'Trancado</span></div>'+img+'<div class="h-kpi"><div><b>62<small>%</small></b><em>Bateria</em></div><div><b>280<small>km</small></b><em>Autonomia</em></div></div>'+quick+'</div>';
  }
}
function itemHTML(r,h,p,K){
  const t=v=>v==="S"?p.s:v==="E"?p.e:v;
  const cls='m-row'+(h?" hl":"");
  const L=x=>'<span class="m-l">'+esc(fillT(x,p))+'</span>';
  switch(r[0]){
    case "link": return '<div class="'+cls+'">'+(K.licon?'<span class="m-li">'+icon(r[1])+'</span>':'')+'<span class="m-l">'+esc(r[1])+(r[2]?'<small>'+esc(r[2])+'</small>':'')+'</span><span class="m-chev">'+svg("chev")+'</span></div>';
    case "radio": return '<div class="'+cls+'"><span class="m-rad'+(r[2]?" on":"")+'"></span>'+L(r[1])+'</div>';
    case "tog": return '<div class="'+cls+'">'+L(r[1])+'<span class="m-sw'+(r[2]?' on':'')+'"><i></i></span></div>';
    case "time": return '<div class="'+cls+'">'+L(r[1])+'<span class="m-time">'+esc(t(r[2]))+'</span></div>';
    case "days": return '<div class="'+cls+' m-dw"><span class="m-days">'+DAYS.map((d,j)=>'<i class="'+(p.days[j]?"on":"")+'">'+d+'</i>').join("")+'</span></div>';
    case "seg": return '<div class="'+cls+' m-sgw"><span class="m-seg">'+r[1].map((o,j)=>'<span class="'+(j===r[2]?"on":"")+'">'+esc(o)+'</span>').join("")+'</span></div>';
    case "val": return '<div class="'+cls+'">'+L(r[1])+'<b class="m-v">'+esc(r[2])+'</b></div>';
    case "slider": return '<div class="'+cls+' m-col"><span class="m-sl-h">'+L(r[1])+'<b class="m-v">'+r[2]+' %</b></span><span class="m-sl"><i style="width:'+r[2]+'%"></i><em style="left:'+r[2]+'%"></em></span></div>';
    case "note": return '<div class="'+cls+' m-nt"><span class="m-note">'+esc(fillT(r[1],p))+'</span></div>';
  }
  return "";
}
function bodyHTML(s,K,p,name){
  const hl=s.hl||[], R=s.rows, home=R.length&&R[0][0]==="hero";
  const t=v=>v==="S"?p.s:v==="E"?p.e:v;
  let out="",grp=[];
  const flush=()=>{if(grp.length){out+='<div class="m-grp">'+grp.join("")+'</div>'; grp=[];}};
  const tile=(l,sm,h)=>'<div class="m-tile'+(h?" hl":"")+'">'+icon(l)+'<span>'+esc(l)+(sm?'<small>'+esc(sm)+'</small>':'')+'</span></div>';
  const fld=(r,h)=>'<div class="m-fld'+(h?" hl":"")+'"><small>'+esc(r[1])+'</small><b>'+esc(t(r[2]))+'</b>'+svg("clock")+'</div>';
  const pc=(r,h)=>'<div class="m-pc'+(h?" hl":"")+'"><small>'+esc(r[1])+'</small><b>'+esc(t(r[2]))+'</b></div>';
  for(let i=0;i<R.length;i++){
    const r=R[i], h=hl.includes(i), nx=R[i+1];
    if(r[0]==="hero"){flush(); if(K.home!=="band") out+=heroHTML(K,name); continue;}
    if(r[0]==="batt"){flush(); out+=battHTML(r[1],K); continue;}
    if(r[0]==="warn"){flush(); out+='<div class="m-warn">'+svg("info")+'<span>'+esc(r[1])+'</span></div>'; continue;}
    if(r[0]==="sect"){flush(); out+='<div class="m-sect">'+esc(r[1])+'</div>'; continue;}
    if(r[0]==="tiles"){flush(); out+='<div class="m-tl">'+r[1].map((l,j)=>tile(l,"",j===r[2]&&h)).join("")+'</div>'; continue;}
    if(home&&r[0]==="link"&&K.homeLinks==="tiles"){flush(); let ts=[]; while(i<R.length&&R[i][0]==="link"){ts.push(tile(R[i][1],R[i][2],hl.includes(i))); i++;} i--; out+='<div class="m-tl">'+ts.join("")+'</div>'; continue;}
    if(r[0]==="time"&&(K.time==="pair"||K.time==="field")){flush();
      const f=K.time==="pair"?pc:fld;
      if(nx&&nx[0]==="time"){out+='<div class="m-pair">'+f(r,h)+f(nx,hl.includes(i+1))+'</div>'; i++;} else out+='<div class="m-pair">'+f(r,h)+'</div>';
      continue;}
    grp.push(itemHTML(r,h,p,K));
  }
  flush();
  return out;
}
function themeFor(g,s,b){
  const k=s.k||g.k||"app";
  const key=s.th||(k==="app"&&BRAND_THEME[b.name])||g.th||"generic";
  return {k,T:THEMES[key]||THEMES.generic,key:THEMES[key]?key:"generic"};
}
const SB_ICONS='<span class="m-ic"><svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx=".6"/><rect x="5" y="5" width="3" height="7" rx=".6"/><rect x="10" y="2.5" width="3" height="9.5" rx=".6"/><rect x="15" y="0" width="3" height="12" rx=".6"/></svg><svg viewBox="0 0 26 12" aria-hidden="true"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="14" height="8" rx="1.6"/><rect x="23.5" y="4" width="1.8" height="4" rx=".8" opacity=".5"/></svg></span>';
const SKIN_DEF={home:"dash",list:"card",hd:"l",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"bar",seg:"pill",r:"14px",br:"999px",tabs:4,ind:"plain",quick:"",tw:700,ff:"-apple-system,'SF Pro Text',Inter,Roboto,Arial,sans-serif"};
function appLabel(k,T,b){return k==="wb"?"App da wallbox":(b.app||T.name||"App da marca");}
function deviceHTML(g,b,p){
  const s=g.screens[MS.screen], {k,T,key}=themeFor(g,s,b);
  const K=Object.assign({},SKIN_DEF,(typeof SKIN!=="undefined"&&SKIN[key])||{});
  const fam=MS.family?(b.name==="Smart"&&/^\d$/.test(MS.family.name)?"#"+MS.family.name:MS.family.name):"";
  const name=b.other?"O seu carro":(fam?(K.short?fam:(b.name==="Smart"?"smart "+fam:b.name+" "+fam)):b.name);
  const home=s.rows.length&&s.rows[0][0]==="hero";
  const band=!!(K.band&&T.hd);
  const acct=contrast(T.acc,T.bg)<2.6?T.fg:T.acc;
  const rs=Math.min(parseFloat(K.r)||0,8)+"px";
  const vars="--bg:"+T.bg+";--card:"+T.card+";--fg:"+T.fg+";--mut:"+T.mut+";--line:"+T.line+";--acc:"+T.acc+";--on:"+T.on+";--acct:"+acct+
    ";--hd:"+(T.hd||T.bg)+";--hdfg:"+(T.hdfg||T.fg)+";--r:"+K.r+";--rs:"+rs+";--br:"+K.br+";--tw:"+K.tw+";--ff:"+K.ff+";--hf:"+(K.hf||K.ff)+
    ";--chip:"+rgba(T.fg,T.dark?.1:.06)+";--pill:"+rgba(acct,.16)+";--ringc:"+(K.ringc||"#34C759");
  const cls="dev phone sk-"+key+(T.dark?" dark":" light")+" l-"+K.list+" hd-"+K.hd+" sw-"+K.sw+" tm-"+K.time+" dy-"+K.day+" bt-"+K.btn+" sg-"+K.seg+" ind-"+K.ind+(K.up?" up":"")+(band?" band":"")+(s.btn?" has-btn":"")+((s.hl||[]).length?" spot":"")+((k==="app"&&home&&K.tabs)?" has-tabs":"")+(home?" is-home h-"+K.home:"");
  const sb='<div class="m-sb"><span>21:58</span><span class="isl"></span>'+SB_ICONS+'</div>';
  const nav=home?"":'<div class="m-nav">'+(MS.screen>0?'<span class="m-back">'+svg("back")+'</span>':'')+'<b>'+esc(s.t||appLabel(k,T,b))+'</b></div>';
  const top='<div class="m-top">'+sb+(home&&K.home==="band"?heroHTML(K,name):nav)+'</div>';
  const labels=K.tabsL||TAB_DEF;
  const tabs=(k==="app"&&home&&K.tabs)?'<div class="m-tabs'+(K.tabsL?"":" nol")+'">'+labels.slice(0,K.tabs).map((l,j)=>'<span'+(j===0?' class="on"':'')+'><i>'+svg(TAB_IC[l]||"grid")+'</i><em>'+esc(l)+'</em></span>').join("")+'</div>':"";
  const btn=s.btn?'<div class="m-btn"><span>'+esc(s.btn)+'</span></div>':"";
  return '<div class="'+cls+'" style="'+vars+'"><div class="scr">'+top+'<div class="m-body">'+bodyHTML(s,K,p,name)+'</div>'+btn+tabs+'<span class="m-hi"></span></div></div>';
}
const slug=s=>norm(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function shotFor(gk,b,i){
  if(typeof SHOTS==="undefined"||!SHOTS.base||!SHOTS.files.length||b.other) return null;
  const f1=slug(b.name)+"-"+gk+"-"+(i+1)+".webp", f2=gk+"-"+(i+1)+".webp";
  const f=SHOTS.files.indexOf(f1)>-1?f1:SHOTS.files.indexOf(f2)>-1?f2:null;
  return f?SHOTS.base.replace(/\/?$/,"/")+f:null;
}

/* ===================== 3. Interface ===================== */
/* ===================== Oferta comercial (editar aqui) =====================
   Valores copiados de goldenergy.pt/mobilidade-eletrica/carregar-em-casa (17-11-2026).
   VALIDAR com Marketing/Jurídico antes de cada publicação. */
const OFFER = {
  preco: "0,0889 €/kWh",
  precoNum: 0.0889,   /* €/kWh no vazio, sem IVA (igual a «preco») */
  consumo100: 15,     /* kWh aos 100 km, consumo médio assumido */
  iva: 0.23,
  precoNota: "no vazio, em tarifa bi-horária",
  descontoClientes: "+35%",
  telefone: "800 501 070",
  telefoneHref: "tel:+351800501070",
  horario: "Dias úteis, das 9h às 21h",
  adesao: "https://goldenergy.pt/mobilidade-eletrica/carregar-em-casa/", /* todos os botões de adesão levam à página do tarifário */
  pagina: "https://goldenergy.pt/mobilidade-eletrica/carregar-em-casa/",
  precosPdf: "https://goldenergy.pt/resources/data/website/documentos/precos_lp_carregar_em_casa.pdf",
  solar: "https://goldenergy.pt/paineis-solares/",
  notaPreco: "Ao preço da energia acresce o encargo com o financiamento da tarifa social de eletricidade, fixado pela ERSE (Entidade Reguladora dos Serviços Energéticos) na Diretiva n.º 12-A/2025, no valor de 0,0020666 €/kWh para 2026.",
  notaDesconto: "Face ao tarifário de referência «Tarifário GOLD», opção bi-horária, potência contratada de 6,90 kVA.",
};
/* Ilustração oficial Goldenergy (campanha «Electric Love»). Usar sem cortes nem alterações. */
/* Data da última revisão dos guias (mostrada aos clientes) */
const REVISTO = "novembro de 2026";
const IMG = { hero: "/img/electric-love-casa.webp" };
/* Custo indicativo de 100 km no vazio: consumo × preço do vazio × (1 + IVA) */
const eur = x => x.toFixed(2).replace(".", ",") + " €";
const CUSTO100 = eur(OFFER.consumo100 * OFFER.precoNum * (1 + OFFER.iva));
const CUSTO100_CALC = OFFER.consumo100 + " kWh/100 km × " + OFFER.preco + " (vazio) + IVA " + Math.round(OFFER.iva * 100) + "% = " + CUSTO100;
const CUSTO100_NOTA = "Valor indicativo, para um consumo médio de " + OFFER.consumo100 + " kWh aos 100 km, carregando só no vazio. Não inclui a potência contratada, o encargo da tarifa social nem outras taxas.";
/* Ligações com UTM para medir conversões vindas do guia */
/* UTM desligados: as ligações seguem limpas. Para medir conversões no Analytics, mudem para true. */
const USE_UTM = false;
const utm = (url, content) => !USE_UTM ? url : url + (url.includes("?") ? "&" : "?") + "utm_source=guia-carregamento&utm_medium=referral&utm_campaign=carregar-em-casa&utm_content=" + content;
/* Evento para o Google Tag Manager (se existir na página) */
const track = id => { try { (window.dataLayer = window.dataLayer || []).push({ event: "cta_click", cta_id: id }); } catch (e) { } };

/* Imagens externas (logótipos jsdelivr, fotos Wikimedia/EV Database).
   "auto": ativas quando a página abre diretamente no navegador; desativadas dentro de pré-visualizações
   em iframe com política de segurança restritiva (aí usamos iniciais e silhueta, sem pedidos bloqueados).
   Em produção, defina true depois de autorizar estes domínios na CSP do site (img-src). */
const REMOTE_IMAGES = "auto";
const REMOTE = REMOTE_IMAGES === "auto"
  ? (() => { try { return typeof window !== "undefined" && window.self === window.top; } catch (e) { return false; } })()
  : !!REMOTE_IMAGES;
const BRAND_HUE = n => { let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

/* ===================== Utilitários de interface ===================== */
const OTHER = { name: "Outra marca", guide: "generic", app: "", families: [], other: true };
const CYC = { diario: ["22:00", "08:00"], semanal: ["00:00", "07:00"] };
const CYC_NAME = { diario: "Ciclo diário", semanal: "Ciclo semanal" };
const INDEX = [];
BRANDS.forEach(b => b.families.forEach((f, fi) => INDEX.push({ b, f, fi, txt: norm(b.name + " " + (ALIAS[b.name] || "") + " " + f.name + " " + f.versions.map(v => v.name).join(" ")) })));
const lastSunday = (y, m) => { const d = new Date(y, m + 1, 0); d.setDate(d.getDate() - d.getDay()); return d; };
const isSummer = (d = new Date()) => { const y = d.getFullYear(); return d >= lastSunday(y, 2) && d < lastSunday(y, 9); };
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cx = (...a) => a.filter(Boolean).join(" ");
const famLabel = (b, f) => (b.name === "Smart" && /^\d$/.test(f.name) ? "#" + f.name : f.name);
function guideFor(b, f) { if (!b) return null; const gk = (f && f.guide) || b.guide; return { gk, g: GUIDES[gk] || GUIDES.generic }; }

/* Texto dos guias: <b>…</b>, {app}, {inicio}, {fim} → nós React */
function Rich({ text, b, p, link = true }) {
  const out = [];
  String(text).split(/(<b>.*?<\/b>|\{app\}|\{inicio\}|\{fim\})/g).forEach((part, i) => {
    if (!part) return;
    if (part === "{app}") out.push(b.app ? (link ? <AppName key={i} name={b.app} /> : <b key={i}>{b.app}</b>) : (b.other ? "da marca" : "oficial da " + b.name));
    else if (part === "{inicio}" || part === "{fim}") out.push(<Time key={i}>{part === "{inicio}" ? p.s : p.e}</Time>);
    else if (part.startsWith("<b>")) out.push(<b key={i} className="font-bold text-[#171424]">{vzText(part.slice(3, -4), i)}</b>);
    else out.push(...vzText(part, i));
  });
  return <>{out}</>;
}
const plainText = (text, b, p) => String(text).replace(/<\/?b>/g, "").replace(/\{app\}/g, b.app || (b.other ? "da marca" : "oficial da " + b.name)).replace(/\{inicio\}/g, p.s).replace(/\{fim\}/g, p.e);
const Time = ({ children }) => <span className="whitespace-nowrap rounded-md bg-[#E6FAF2] px-1.5 font-bold tabular-nums text-[#146B4F]">{children}</span>;

/* Ícones da interface (traço simples) */
const I = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  check: <path d="m5 12 5 5L20 7" />,
  chevL: <path d="m15 18-6-6 6-6" />,
  chevR: <path d="m9 6 6 6-6 6" />,
  chevD: <path d="m6 9 6 6 6-6" />,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>,
  print: <><path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M6 14h12v7H6z" /></>,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  plug: <><path d="M9 2v6M15 2v6" /><path d="M6 8h12v4a6 6 0 0 1-12 0z" /><path d="M12 18v4" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  refresh: <><path d="M20 11a8 8 0 0 0-14.9-3.5L4 9" /><path d="M4 4v5h5" /><path d="M4 13a8 8 0 0 0 14.9 3.5L20 15" /><path d="M20 20v-5h-5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>,
  ext: <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></>,
  chat: <path d="M4 19.5 5.3 15A8 8 0 1 1 9 18.7z" />,
  car: <><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v3H3z" /><circle cx="7.5" cy="13" r=".8" /><circle cx="16.5" cy="13" r=".8" /></>,
};
const Icon = ({ n, className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{I[n]}</svg>
);
const Ext = () => <span className="sr-only"> (abre numa nova janela)</span>;
/* Nome da app com link para a loja do sistema operativo de quem visita */
const AppName = ({ name, className }) => {
  const url = storeUrl(name);
  if (!url) return <b className={className}>{name}</b>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => track("app_store_" + STORE)} title={"Abrir " + name + " na " + STORE_NAME}
      className={cx("rounded-sm font-bold text-[#382F83] underline decoration-[#40DDA6] decoration-2 underline-offset-2 hover:decoration-[#382F83] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#382F83] focus-visible:ring-offset-2", className)}>
      {name}<span className="sr-only"> (abrir na {STORE_NAME}, numa nova janela)</span><Icon n="ext" className="ml-0.5 inline-block h-[0.85em] w-[0.85em] align-[-0.05em]" />
    </a>
  );
};
/* Lua = vazio · Sol = fora de vazio */
const Moon = ({ className = "mr-[0.2em] inline-block h-[1.05em] w-[1.05em] align-[-0.16em]" }) => (
  <svg viewBox="0 0 24 24" className={cx("flex-none", className)} aria-hidden="true" focusable="false"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="#382F83" stroke="#382F83" strokeWidth="1.5" strokeLinejoin="round" /></svg>
);
const Sun = ({ className = "mr-[0.2em] inline-block h-[1.1em] w-[1.1em] align-[-0.18em]" }) => (
  <svg viewBox="0 0 24 24" className={cx("flex-none", className)} aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.5" fill="#FFC845" stroke="#7A4B00" strokeWidth="1.6" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5" stroke="#7A4B00" strokeWidth="1.8" strokeLinecap="round" /></svg>
);
const Vz = ({ children = "vazio" }) => <span className="whitespace-nowrap"><Moon />{children}</span>;
const Fv = ({ children = "fora de vazio" }) => <span className="whitespace-nowrap"><Sun />{children}</span>;
/* Acrescenta a lua antes de «vazio» e o sol antes de «fora de/do vazio» em texto corrido */
const vzText = (str, k) => String(str).split(/(fora d[oe] vazio|\bvazio\b)/gi).map((t, j) =>
  !t ? null : /^fora/i.test(t) ? <Fv key={k + "-" + j}>{t}</Fv> : /^vazio$/i.test(t) ? <Vz key={k + "-" + j}>{t}</Vz> : t);
const A = ({ href, children, className }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={cx("font-semibold text-[#382F83] underline decoration-[#40DDA6] decoration-2 underline-offset-2 hover:decoration-[#382F83] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#382F83] focus-visible:ring-offset-2 rounded-sm", className)}>{children}<Ext /></a>
);
const FOCUS = "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#382F83] focus-visible:ring-offset-2";
const BTN = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 text-base font-bold motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40 " + FOCUS;
const BTN_P = BTN + " bg-[#40DDA6] text-[#171424] hover:bg-[#5FE6B7] active:bg-[#2FC892]";
/* Azul só nos botões de adesão (conversão) */
const BTN_BLUE = BTN + " bg-[#382F83] text-white hover:bg-[#2A2366] active:bg-[#211B52]";
const BTN_G = BTN + " border-2 border-[#514D5F] bg-white text-[#171424] hover:bg-[#F6F4F8]";
/* Amarelo solar: acento da página de painéis solares (não é cor oficial da paleta; validar hex com Brand) */
const BTN_SOLAR = BTN + " bg-[#FFC845] text-[#171424] hover:bg-[#FFD46E] active:bg-[#F2B623]";
const BTN_ONGREEN = BTN + " border-2 border-[#171424] bg-transparent text-[#171424] hover:bg-white/35 focus-visible:ring-offset-[#40DDA6]";
const LINKBTN = "rounded-sm font-semibold text-[#382F83] underline decoration-[#40DDA6] decoration-2 underline-offset-4 hover:decoration-[#382F83] " + FOCUS;

/* Logótipo da marca com recurso às iniciais */
function BrandLogo({ b, size = "md" }) {
  const [fail, setFail] = useState(false);
  const dim = { xs: "h-7 w-7 text-[10px]", sm: "h-10 w-10 text-xs", md: "h-12 w-12 text-sm", lg: "h-16 w-16 text-base" }[size];
  const isOther = !b || b.other;
  return (
    <span className={cx("flex flex-none items-center justify-center overflow-hidden rounded-xl border border-[#D9D5E0] bg-white p-1.5", dim)} aria-hidden="true">
      {isOther ? <Icon n="car" className="h-3/4 w-3/4 text-[#514D5F]" />
        : (fail || !REMOTE) ? <b className="flex h-full w-full items-center justify-center rounded-lg font-black tracking-tight" style={{ background: "hsl(" + BRAND_HUE(b.name) + " 45% 93%)", color: "hsl(" + BRAND_HUE(b.name) + " 55% 28%)" }}>{initials(b.name)}</b>
        : <img src={logoUrl(b.name)} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" onError={() => setFail(true)} />}
    </span>
  );
}

/* Fotografia do modelo com recurso à silhueta */
function CarPhoto({ photo, alt, className }) {
  const [fail, setFail] = useState(false);
  useEffect(() => setFail(false), [photo && photo.src]);
  if (!photo || fail) return <span className={cx("flex items-center justify-center bg-[#F6F4F8] text-[#9A95A8]", className)} dangerouslySetInnerHTML={{ __html: CAR_SVG }} />;
  return <img src={photo.src} alt={alt} loading="lazy" decoding="async" className={cx("bg-[#F6F4F8] object-cover", className)} onError={() => setFail(true)} />;
}

/* Cabeçalho e moldura de cada passo */
function Step({ n, title, state, summary, onEdit, editLabel, lockedText, headRef, children }) {
  const done = state === "done", open = state === "open", locked = state === "locked";
  return (
    <section aria-labelledby={"t" + n}
      className={cx("scroll-mt-20 rounded-[1.75rem] border p-5 sm:scroll-mt-28 sm:p-7 motion-safe:transition-shadow", open ? "border-[#D9D5E0] bg-white shadow-[0_12px_32px_-18px_rgba(23,20,36,.28)]" : "border-[#E7E4EC]", locked ? "bg-white/60" : "bg-white")}>
      <div className="flex items-center gap-3 sm:gap-4">
        <span aria-hidden="true" className={cx("flex h-10 w-10 flex-none items-center justify-center rounded-full text-lg font-black",
          done ? "bg-[#146B4F] text-white" : open ? "bg-[#40DDA6] text-[#171424]" : "bg-[#EEEBF2] text-[#8C87A0]")}>
          {done ? <Icon n="check" className="h-5 w-5" /> : n}
        </span>
        <h2 id={"t" + n} ref={headRef} tabIndex={-1} className={cx("min-w-0 flex-1 text-xl font-black leading-tight sm:text-2xl focus:outline-none", locked ? "text-[#8C87A0]" : "text-[#171424]")}>
          {title}<span className="sr-only">{done ? ", concluído" : locked ? ", ainda não disponível" : ""}</span>
        </h2>
        {done && onEdit && (
          <button type="button" onClick={onEdit} className={cx("min-h-[44px] flex-none rounded-full px-3 text-sm print:hidden", LINKBTN)}>
            Alterar<span className="sr-only"> {editLabel}</span>
          </button>
        )}
      </div>
      {locked && <p className="mt-2 pl-[3.25rem] text-base text-[#6E6980] sm:pl-14">{lockedText}</p>}
      {done && summary && <div className="mt-3 sm:pl-14">{summary}</div>}
      {open && <div className="mt-5 sm:mt-6">{children}</div>}
    </section>
  );
}

/* Telemóvel com a ilustração do ecrã da app */
/* Fontes das maquetas (Google Fonts): carrega-se só a família da app mostrada, uma vez */
const GFONTS = { "Inter": "Inter:wght@400;500;600;700", "Montserrat": "Montserrat:wght@500;600;700", "DM Sans": "DM+Sans:wght@400;500;700", "Poppins": "Poppins:wght@400;500;600", "Roboto": "Roboto:wght@400;500;700", "Source Sans 3": "Source+Sans+3:wght@400;600" };
const fontsLoaded = new Set();
function loadMockFont(ff) {
  const m = /'([^']+)'/.exec(ff || ""), fam = m && m[1];
  if (!fam || !GFONTS[fam] || fontsLoaded.has(fam) || typeof document === "undefined") return;
  fontsLoaded.add(fam);
  const l = document.createElement("link");
  l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=" + GFONTS[fam] + "&display=swap";
  document.head.appendChild(l);
}
/* Só se desenha uma maqueta: dentro do passo (telemóvel) ou ao lado (computador) */
function useDesktop() {
  const q = "(min-width: 768px)";
  const get = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q).matches : null);
  const [d, setD] = useState(get);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(q), on = () => setD(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);
  return d;
}
function PhoneMock({ g, b, p, gk, screen, family, photo }) {
  MS = { screen, family, photo };
  const s = g.screens[screen];
  const { k, T, key } = themeFor(g, s, b);
  const label = appLabel(k, T, b) + " · " + (s.cap || s.t || "Ecrã");
  const shot = shotFor(gk, b, screen);
  const [shotFail, setShotFail] = useState(false);
  /* O HTML da maqueta só se recalcula quando muda o carro, o ecrã ou o horário */
  const html = useMemo(() => { MS = { screen, family, photo }; return deviceHTML(g, b, p); }, [g, b, p.s, p.e, screen, family, photo]);
  const sk = (typeof SKIN !== "undefined" && SKIN[key]) || {};
  useEffect(() => { loadMockFont(sk.ff); loadMockFont(sk.hf); }, [sk.ff, sk.hf]);
  return (
    <figure className="m-0 flex flex-col items-center">
      {shot && !shotFail
        ? <img src={shot} alt={"Captura real da app: " + label} decoding="async" onError={() => setShotFail(true)} className="w-[272px] max-w-full rounded-[2.5rem] border-[.55rem] border-[#0A0A0A] bg-white shadow-[0_18px_40px_rgba(23,20,36,.22)]" />
        : <div className="gm w-[272px] max-w-full" aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />}
      <figcaption className="mt-3 max-w-[280px] text-center text-[0.82rem] leading-snug text-[#514D5F]">
        <b className="text-[#171424]">{label}</b><br />
        {shot && !shotFail ? "Captura real da app. Pode variar com a versão." : "Ilustração simplificada. Siga os nomes a negrito nos passos: o aspeto da app pode ser diferente."}
      </figcaption>
    </figure>
  );
}

/* ===================== Página ===================== */
export default function GuiaCarregamento() {
  const [brandName, setBrandName] = useState("");      // "" | nome | "__other"
  const [famIdx, setFamIdx] = useState(-1);
  const [verIdx, setVerIdx] = useState(-1);
  const [cyc, setCyc] = useState("diario");
  const [secs, setSecs] = useState({ 1: "open", 2: "locked", 3: "locked" });
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [q, setQ] = useState("");
  const [qOpen, setQOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const h1 = useRef(null), h2 = useRef(null), h3 = useRef(null), doneRef = useRef(null), go2Ref = useRef(null);
  const focusNext = useRef(null);

  const b = brandName === "__other" ? OTHER : BRANDS.find(x => x.name === brandName) || null;
  const f = b && !b.other && famIdx > -1 ? b.families[famIdx] : null;
  const v = f ? (f.versions.length === 1 ? f.versions[0] : f.versions[verIdx] || null) : null;
  const ready = !!(b && (b.other || f));
  const photo = REMOTE && b && f && !b.other ? photoFor(b, f) : null;
  const p = { s: CYC[cyc][0], e: CYC[cyc][1], days: [1, 1, 1, 1, 1, 1, 1] };
  const G = ready ? guideFor(b, f) : null;
  const n = G ? G.g.steps.length : 0;
  const cur = Math.min(step, Math.max(0, n - 1));
  const screen = G ? Math.min(G.g.map[cur] || 0, G.g.screens.length - 1) : 0;
  const carTitle = b ? (b.other ? "Outra marca ou modelo" : b.name + (f ? " " + famLabel(b, f) : "")) : "";

  const say = t => { setMsg(""); setTimeout(() => setMsg(t), 60); };
  const scrollTo = ref => {
    const el = ref.current; if (!el) return;
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
    const sec = el.closest("section") || el;
    sec.scrollIntoView && sec.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
  };
  useEffect(() => { const r = focusNext.current; if (r) { focusNext.current = null; scrollTo(r); } });

  function startGuide() {
    track("hero_comecar");
    if (secs[1] !== "open") setSecs(sv => ({ ...sv, 1: "open" }));
    focusNext.current = h1;
    setTimeout(() => { const el = document.getElementById("q"); if (el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } } }, 400);
  }

  /* Seleção do carro */
  const resetGuide = () => { setStep(0); setFinished(false); setShowAll(false); };
  function pickBrand(name, fi) {
    const nb = BRANDS.find(x => x.name === name);
    setBrandName(nb ? name : "");
    const idx = fi != null ? fi : nb && nb.families.length === 1 ? 0 : -1;
    setFamIdx(idx); setVerIdx(-1); resetGuide();
    if (nb && idx > -1) say(nb.name + " " + nb.families[idx].name + " escolhido.");
  }
  function pickOther() { setBrandName("__other"); setFamIdx(-1); setVerIdx(-1); resetGuide(); setQ(""); say("Guia geral escolhido."); setTimeout(() => go2Ref.current && go2Ref.current.focus(), 50); }
  function pickModel(i) { setFamIdx(i); setVerIdx(-1); resetGuide(); if (i > -1) say(b.name + " " + b.families[i].name + " escolhido."); }

  /* Pesquisa */
  const tq = norm(q.trim());
  const parts = tq.split(/\s+/).filter(Boolean);
  const hits = tq.length >= 2 ? INDEX.filter(x => parts.every(pt => x.txt.includes(pt))).slice(0, 8) : [];
  const showRes = qOpen && tq.length >= 2;
  const optCount = hits.length + 1;
  useEffect(() => { if (tq.length >= 2) say(hits.length ? hits.length + " resultados." : "Sem resultados."); }, [tq]);
  function choose(i) {
    setQOpen(false); setActive(-1);
    if (i >= hits.length) { pickOther(); return; }
    const h = hits[i]; pickBrand(h.b.name, h.fi); setQ(h.b.name + " " + h.f.name);
  }
  function onKey(e) {
    if (!showRes) { if (e.key === "ArrowDown" && tq.length >= 2) { setQOpen(true); e.preventDefault(); } return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => (a + 1) % optCount); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => (a - 1 + optCount) % optCount); }
    else if (e.key === "Enter") { e.preventDefault(); choose(active > -1 ? active : 0); }
    else if (e.key === "Escape") { setQOpen(false); setActive(-1); }
  }
  const mark = s => {
    const ns = norm(s); let ranges = [];
    parts.forEach(pt => { if (pt.length < 2) return; const i = ns.indexOf(pt); if (i > -1) ranges.push([i, i + pt.length]); });
    if (!ranges.length) return s;
    ranges.sort((x, y) => x[0] - y[0]);
    const out = []; let last = 0;
    ranges.forEach(([a, z], k) => { if (a < last) return; out.push(s.slice(last, a)); out.push(<mark key={k} className="rounded-sm bg-[#C9F5E5] text-[#171424]">{s.slice(a, z)}</mark>); last = z; });
    out.push(s.slice(last)); return out;
  };

  /* Navegação entre passos */
  function goStep2() {
    if (!ready) return;
    if (secs[2] === "done") { setSecs({ 1: "done", 2: "done", 3: "open" }); resetGuide(); focusNext.current = h3; if (G) say("Guia pronto: " + n + " passos."); }
    else { setSecs({ 1: "done", 2: "open", 3: "locked" }); focusNext.current = h2; }
  }
  function goStep3() { setSecs({ 1: "done", 2: "done", 3: "open" }); resetGuide(); focusNext.current = h3; if (G) say("Guia pronto: " + n + " passos."); }
  function edit(nr) {
    setSecs(sv => ({ ...sv, [nr]: "open" }));
    focusNext.current = nr === 1 ? h1 : h2;
  }
  function go(i) {
    const k = Math.max(0, Math.min(n - 1, i)); setStep(k); setFinished(false);
    say("Passo " + (k + 1) + " de " + n + ": " + plainText(G.g.steps[k], b, p));
  }
  function finish() { setFinished(true); say("Está programado."); setTimeout(() => { const el = doneRef.current; if (el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } el.scrollIntoView && el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "center" }); } }, 30); }

  /* Ligação partilhável */
  const hashStr = () => {
    if (!b) return "";
    const u = new URLSearchParams();
    if (b.other) u.set("marca", "outra"); else { u.set("marca", b.name); if (f) u.set("modelo", f.name); if (v && f.versions.length > 1) u.set("versao", v.name); }
    u.set("ciclo", cyc); return u.toString();
  };
  useEffect(() => { if (secs[3] === "open" && ready) { try { history.replaceState(null, "", "#" + hashStr()); } catch (e) { } } }, [secs[3], brandName, famIdx, verIdx, cyc]);
  useEffect(() => {
    let u; try { u = new URLSearchParams((location.hash || "").slice(1)); } catch (e) { return; }
    const m = u.get("marca"); if (!m) return;
    if (u.get("ciclo") === "semanal") setCyc("semanal");
    if (m === "outra") setBrandName("__other");
    else {
      const nb = BRANDS.find(x => x.name === m); if (!nb) return;
      const fi = nb.families.findIndex(x => x.name === u.get("modelo"));
      const idx = fi > -1 ? fi : nb.families.length === 1 ? 0 : -1; if (idx < 0) return;
      setBrandName(nb.name); setFamIdx(idx);
      const vi = nb.families[idx].versions.findIndex(x => x.name === u.get("versao")); if (vi > -1) setVerIdx(vi);
    }
    setSecs({ 1: "done", 2: "done", 3: "open" });
  }, []);
  const linkUrl = () => { let base = ""; try { base = location.href.split("#")[0]; } catch (e) { } return base + "#" + hashStr(); };
  function copyLink() {
    const url = linkUrl();
    const ok = () => { setCopied(true); say("Ligação copiada."); setTimeout(() => setCopied(false), 2500); };
    const fb = () => {
      try { const ta = document.createElement("textarea"); ta.value = url; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); const r = document.execCommand("copy"); ta.remove(); r ? ok() : say("Não foi possível copiar. Copie o endereço na barra do navegador."); }
      catch (e) { say("Não foi possível copiar. Copie o endereço na barra do navegador."); }
    };
    try { navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(url).then(ok, fb) : fb(); } catch (e) { fb(); }
  }

  const summer = isSummer();
  const foraRows = cyc === "diario"
    ? [["Todos os dias", ["08:00 → 22:00"]]]
    : [["Segunda a sexta", ["07:00 → 24:00"]],
       ["Sábado", summer ? ["09:00–14:00", "20:00–22:00"] : ["09:30–13:00", "18:30–22:00"]],
       ["Domingo", ["Sem horas fora de vazio"]]];
  const vazioRows = cyc === "diario"
    ? [["Todos os dias", ["22:00 → 08:00"]]]
    : [["Segunda a sexta", ["00:00 → 07:00"]],
       ["Sábado", summer ? ["00:00–09:00", "14:00–20:00", "22:00–24:00"] : ["00:00–09:30", "13:00–18:30", "22:00–24:00"]],
       ["Domingo", ["Todo o dia"]]];

  /* ---------- Resumos ---------- */
  const sum1 = b && (
    <div className="flex items-center gap-3 rounded-2xl bg-[#F6F4F8] p-3">
      <BrandLogo b={b} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-[#171424]">{carTitle}</p>
        <p className="truncate text-sm text-[#514D5F]">{b.other ? "Guia geral" : [v && f && f.versions.length > 1 ? v.name : "", b.app ? "App " + b.app : ""].filter(Boolean).join(" · ")}</p>
      </div>
      {photo && <CarPhoto photo={photo} alt="" className="hidden h-12 w-20 flex-none rounded-lg sm:block" />}
    </div>
  );
  const sum2 = (
    <div className="flex items-center gap-3 rounded-2xl bg-[#F6F4F8] p-3">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white"><Moon className="h-5 w-5" /></span>
      <div><p className="font-bold text-[#171424]">Vazio das {p.s} às {p.e}</p><p className="text-sm text-[#514D5F]">{CYC_NAME[cyc]}</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F4F8] text-[#171424] antialiased" style={{ fontFamily: "'Brandon Grotesque','Brandon Text',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif" }}>
      <style>{ALL_CSS}</style>
      <a href="#guia" className="sr-only z-50 rounded-full bg-white px-4 py-2 font-bold text-[#382F83] focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Saltar para o guia</a>

      {/* Barra superior fixa, com adesão sempre à mão */}
      <div className="sticky top-0 z-40 border-b border-[#E7E4EC] bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[88px] sm:px-6">
          <a href={utm("https://goldenergy.pt/", "logo")} className={cx("flex-none rounded-md", FOCUS)} onClick={() => track("logo")}>
            <img src={LOGO} alt="Goldenergy, página inicial" width="120" height="73" className="h-11 w-auto sm:h-[73px]" />
          </a>
          <span className="hidden border-l border-[#D9D5E0] pl-3 text-sm font-bold uppercase tracking-wider text-[#514D5F] lg:inline">Tarifário Carregar em Casa</span>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <a href={OFFER.telefoneHref} onClick={() => track("header_telefone")} className={cx("hidden items-center gap-2 rounded-full px-2 text-[#171424] md:flex", FOCUS)}>
              <Icon n="phone" className="h-5 w-5 text-[#146B4F]" />
              <span className="leading-tight"><b className="block text-base">{OFFER.telefone}</b><span className="block text-xs text-[#514D5F]">Chamada gratuita</span></span>
            </a>
            <a href={utm(OFFER.adesao, "header")} target="_blank" rel="noopener noreferrer" onClick={() => track("header_aderir")} className={cx(BTN_BLUE, "min-h-[44px] px-4 text-base sm:px-5")}>
              <span>Aderir<span className="hidden sm:inline"> ao tarifário</span></span><Ext />
            </a>
          </div>
        </div>
      </div>

      {/* Topo */}
      <header className="bg-[#40DDA6] pb-14 text-[#171424] sm:pb-24 print:hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-7 px-4 pt-7 sm:px-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-10 md:pt-12">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[#382F83]">Mobilidade elétrica · Guia prático</p>
            <h1 className="mt-3 text-[2rem] font-black leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
              Programe o carro para carregar nas horas de <span className="whitespace-nowrap text-[#382F83]"><Moon className="mr-[0.15em] inline-block h-[0.85em] w-[0.85em] align-[-0.06em]" />vazio</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed">Escolha o carro e siga os passos na app. São 3 passos e poucos minutos. Depois, o carro passa a carregar à noite, quando a eletricidade custa menos.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" onClick={startGuide} className={cx(BTN_BLUE, "px-7")}>Começar o guia<Icon n="arrow" /></button>
              <a href={utm(OFFER.pagina, "hero")} target="_blank" rel="noopener noreferrer" onClick={() => track("hero_tarifario")} className={BTN_ONGREEN}>Ver o tarifário Carregar em Casa<Ext /></a>
            </div>
            <Cost100 />
          </div>
          <div className="mx-auto w-full max-w-md md:max-w-none">
            <img src={IMG.hero} alt="A casa sorridente da Goldenergy, com painéis solares no telhado, a carregar o carro elétrico na garagem" width="727" height="473"
              fetchPriority="high"
              className="mx-auto block aspect-[727/473] w-full max-w-sm bg-[#40DDA6] object-contain sm:max-w-md md:max-w-none" />
          </div>
        </div>
      </header>

      <main id="guia" tabIndex={-1} className="relative mx-auto -mt-8 flex max-w-5xl flex-col gap-4 px-3 pb-10 focus:outline-none sm:-mt-12 sm:gap-5 sm:px-6 print:mt-0">
        <p className="hidden text-2xl font-black text-[#146B4F] print:block">Goldenergy · Programar o carregamento nas horas de vazio</p>

        {/* PASSO 1 */}
        <Step n={1} title="Qual é o seu carro?" state={secs[1]} headRef={h1} summary={sum1} onEdit={() => edit(1)} editLabel="carro">
          <div className="relative">
            <label htmlFor="q" className="mb-2 block font-bold">Pesquise pelo modelo</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#514D5F]"><Icon n="search" /></span>
              <input id="q" type="search" value={q} autoComplete="off" spellCheck={false} placeholder="Ex.: Model Y, e-208, iX1, Dolphin"
                role="combobox" aria-expanded={showRes} aria-controls="qres" aria-autocomplete="list" aria-describedby="qHint"
                aria-activedescendant={showRes && active > -1 ? "o" + active : undefined}
                onChange={e => { setQ(e.target.value); setQOpen(true); setActive(-1); }}
                onFocus={() => setQOpen(true)} onBlur={() => setTimeout(() => setQOpen(false), 150)} onKeyDown={onKey}
                className="min-h-[52px] w-full rounded-2xl border-2 border-[#D9D5E0] bg-white pl-12 pr-4 text-base placeholder:text-[#8C87A0] hover:border-[#B9B3C6] focus:border-[#146B4F] focus:outline-none focus:ring-4 focus:ring-[#40DDA6]/35" />
            </div>
            <p id="qHint" className="sr-only">Escreva pelo menos 2 letras. Use as setas para escolher e Enter para confirmar.</p>
            {showRes && (
              <ul id="qres" role="listbox" aria-label="Modelos encontrados" className="absolute inset-x-0 top-full z-30 mt-2 max-h-[min(420px,60vh)] overflow-auto rounded-2xl border border-[#D9D5E0] bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(23,20,36,.35)]">
                {hits.map((h, i) => (
                  <li key={h.b.name + h.fi} id={"o" + i} role="option" aria-selected={i === active}
                    onMouseDown={e => { e.preventDefault(); choose(i); }} onMouseEnter={() => setActive(i)}
                    className={cx("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5", i === active && "bg-[#E6FAF2]")}>
                    <BrandLogo b={h.b} size="xs" />
                    <span className="min-w-0 flex-1 truncate"><b>{mark(h.b.name)}</b> {mark(h.f.name)}{h.f.old && <span className="text-sm text-[#514D5F]"> · modelo anterior</span>}</span>
                    <Icon n="chevR" className="h-4 w-4 flex-none text-[#8C87A0]" />
                  </li>
                ))}
                {!hits.length && <li className="px-3 py-2.5 text-[#514D5F]" aria-hidden="true">Não encontrámos «{q.trim()}».</li>}
                <li id={"o" + hits.length} role="option" aria-selected={active === hits.length}
                  onMouseDown={e => { e.preventDefault(); choose(hits.length); }} onMouseEnter={() => setActive(hits.length)}
                  className={cx("mt-1 cursor-pointer rounded-xl border-t border-[#EEEBF2] px-3 py-2.5 font-semibold text-[#146B4F]", active === hits.length && "bg-[#E6FAF2]")}>
                  Não está aqui? Usar o guia geral
                </li>
              </ul>
            )}
          </div>

          <p id="chipsT" className="mb-3 mt-6 text-sm font-semibold text-[#514D5F]">ou escolha a marca</p>
          <div role="group" aria-labelledby="chipsT" className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {TOP.map(nm => {
              const tb = BRANDS.find(x => x.name === nm), on = brandName === nm;
              return (
                <button key={nm} type="button" aria-pressed={on} onClick={() => pickBrand(nm)}
                  className={cx("flex min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-1 py-2 text-center text-[0.8rem] font-bold leading-tight motion-safe:transition-colors sm:text-sm", FOCUS,
                    on ? "border-[#146B4F] bg-[#E6FAF2] text-[#146B4F]" : "border-[#EEEBF2] bg-white text-[#171424] hover:border-[#B9B3C6]")}>
                  <BrandLogo b={tb} size="sm" /><span className="max-w-full truncate">{nm}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field id="selBrand" label="Marca">
              <select id="selBrand" value={b && !b.other ? b.name : ""} onChange={e => pickBrand(e.target.value)} className={SELECT}>
                <option value="">Escolher marca…</option>
                <optgroup label="Mais procuradas">{TOP.map(nm => <option key={"t" + nm} value={nm}>{nm}</option>)}</optgroup>
                <optgroup label="Todas as marcas (A–Z)">{BRANDS.map(x => <option key={x.name} value={x.name}>{x.name}</option>)}</optgroup>
              </select>
            </Field>
            <Field id="selModel" label="Modelo">
              <select id="selModel" value={famIdx} disabled={!b || b.other} onChange={e => pickModel(+e.target.value)} className={SELECT}>
                <option value={-1}>{b && !b.other ? "Escolher modelo…" : "Primeiro a marca"}</option>
                {b && !b.other && b.families.map((x, i) => <option key={i} value={i}>{famLabel(b, x) + (x.old ? " (modelo anterior)" : "")}</option>)}
              </select>
            </Field>
            {f && f.versions.length > 1 && (
              <Field id="selVer" label="Versão" opt>
                <select id="selVer" value={verIdx} onChange={e => setVerIdx(+e.target.value)} className={SELECT}>
                  <option value={-1}>Não sei / todas</option>
                  {f.versions.map((x, i) => <option key={i} value={i}>{x.name + (x.old ? " (modelo anterior" + (x.note ? ", " + x.note : "") + ")" : "")}</option>)}
                </select>
              </Field>
            )}
          </div>

          {b && (
            <div className="mt-5 overflow-hidden rounded-2xl border-2 border-[#40DDA6] bg-[#F3FDF9]">
              <div className="flex flex-col-reverse sm:flex-row">
                <div className="flex min-w-0 flex-1 items-start gap-3 p-4 sm:p-5">
                  <BrandLogo b={b} size="lg" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#514D5F]">{b.other ? "Guia geral" : b.name}</p>
                    <p className="text-xl font-black leading-tight">{b.other ? "Outra marca ou modelo" : f ? famLabel(b, f) : "Agora escolha o modelo"}</p>
                    {v && f && f.versions.length > 1 && <p className="mt-0.5 text-base text-[#171424]">{v.name}</p>}
                    {b.other && <p className="mt-1 text-base text-[#514D5F]">Mostramos os passos comuns à maioria das apps.</p>}
                    {!b.other && b.app && (storeUrl(b.app)
                      ? <a href={storeUrl(b.app)} target="_blank" rel="noopener noreferrer" onClick={() => track("app_store_" + STORE)} className={cx("mt-2 inline-flex min-h-[44px] max-w-full items-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold text-[#146B4F] ring-1 ring-[#CFEFE2] transition-colors hover:bg-[#E6FAF2] hover:ring-[#40DDA6]", FOCUS)}>
                          <Icon n="bolt" className="h-4 w-4 flex-none" /><span className="truncate">App {b.app}</span><span className="flex-none font-normal text-[#514D5F]">· {STORE_NAME}</span><Icon n="ext" className="h-3.5 w-3.5 flex-none" /><Ext />
                        </a>
                      : <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-[#146B4F]"><Icon n="bolt" className="h-4 w-4" />App {b.app}</p>)}
                    {v && v.id && <p className="mt-2 text-sm"><A href={evUrl(b, v)}>Ficha técnica</A></p>}
                  </div>
                </div>
                {f && (
                  <figure className="relative m-0 h-40 flex-none sm:h-auto sm:w-64">
                    <CarPhoto photo={photo} alt={b.name + " " + f.name} className="h-full w-full" />
                    {photo && <a href={photo.href} target="_blank" rel="noopener noreferrer" className="absolute bottom-1.5 right-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{photo.credit}<Ext /></a>}
                  </figure>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            {ready && <button ref={go2Ref} type="button" onClick={goStep2} className={BTN_P}>{secs[2] === "done" ? "Ver os passos" : "Continuar para o horário"}<Icon n="chevR" /></button>}
            {!(b && b.other) && <button type="button" onClick={pickOther} className={cx("self-center py-2 sm:self-auto", LINKBTN)}>O nosso carro não está na lista</button>}
          </div>
        </Step>

        {/* PASSO 2 */}
        <Step n={2} title={<>O seu horário de <Vz /></>} state={secs[2]} headRef={h2} summary={sum2} onEdit={() => edit(2)} editLabel="ciclo" lockedText="Disponível depois de escolher o carro.">
          <fieldset>
            <legend className="mb-3 font-bold">Que ciclo tem o seu tarifário bi-horário?</legend>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[["diario", "Ciclo diário", "Igual todos os dias"], ["semanal", "Ciclo semanal", "Muda ao fim de semana"]].map(([val, t, d]) => (
                <label key={val} className="block cursor-pointer">
                  <input type="radio" name="cyc" value={val} checked={cyc === val} onChange={() => { setCyc(val); }} className="peer sr-only" />
                  <span className={cx("flex h-full flex-col rounded-2xl border-2 p-3.5 motion-safe:transition-colors sm:p-4 peer-focus-visible:ring-[3px] peer-focus-visible:ring-[#382F83] peer-focus-visible:ring-offset-2",
                    cyc === val ? "border-[#146B4F] bg-[#E6FAF2]" : "border-[#EEEBF2] bg-white hover:border-[#B9B3C6]")}>
                    <span className="flex items-center gap-2 font-black text-[#171424]">
                      <span aria-hidden="true" className={cx("flex h-5 w-5 flex-none items-center justify-center rounded-full border-2", cyc === val ? "border-[#146B4F]" : "border-[#B9B3C6]")}>{cyc === val && <span className="h-2.5 w-2.5 rounded-full bg-[#146B4F]" />}</span>{t}
                    </span>
                    <span className="mt-1 pl-7 text-sm text-[#514D5F]">{d}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="mt-3 text-base text-[#514D5F]">Não sabe qual é? Está na fatura, junto à opção tarifária.</p>

          <div className="mt-4 rounded-2xl bg-[#E6FAF2] p-4 sm:p-5" aria-live="polite">
            {/* Vazio e fora de vazio no mesmo formato: dia à esquerda, horas logo ao lado */}
            {[["vz", vazioRows], ["fv", foraRows]].map(([kind, rows], gi) => (
              <div key={kind} className={cx(gi && "mt-3 border-t border-[#BFEBD9] pt-3")}>
                <p className={cx("flex flex-wrap items-baseline gap-x-2 font-black", kind === "vz" ? "text-[#146B4F]" : "text-[#171424]")}>
                  {kind === "vz" ? <Vz>Vazio</Vz> : <Fv>Fora de vazio</Fv>}
                  {kind === "vz" && cyc === "semanal" && <span className="text-sm font-semibold text-[#514D5F]">· horário de {summer ? "verão" : "inverno"}</span>}
                  {kind === "fv" && <span className="text-sm font-semibold text-[#514D5F]">· mais caro</span>}
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {rows.map(([d, hs]) => (
                    <li key={d} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="w-full text-base text-[#514D5F] sm:w-36 sm:flex-none">{d}</span>
                      <span className="flex flex-wrap gap-1.5">{hs.map(h => (
                        <b key={h} className={cx("rounded-lg px-2 py-0.5 font-bold tabular-nums", kind === "vz" ? "bg-white text-[#171424]" : "bg-white/60 text-[#514D5F]", cyc === "diario" ? "text-xl" : "text-base")}>{h}</b>
                      ))}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="mt-3 text-base text-[#514D5F]">Evite carregar <Fv />: a eletricidade é mais cara.</p>
            <p className="mt-2 text-base">
              No carro vamos programar <Time>{p.s} → {p.e}</Time>{cyc === "semanal" ? <>, todos os dias. É o horário que fica sempre em <Vz />.</> : "."}
            </p>
          </div>
          <div className="mt-4"><Note>
            <b className="text-[#171424]">Em 2027, as horas de vazio mudam.</b> Entre julho e dezembro de 2027, quando o seu contador for atualizado, o <Vz /> {cyc === "diario" ? <>passa a ser das <b>22:30</b> às <b>08:30</b></> : <>dos dias úteis passa a ser das <b>00:30</b> às <b>07:30</b></>}. Se preferir não ter de mudar nada, programe já {cyc === "diario" ? <Time>22:30 → 08:00</Time> : <Time>00:30 → 07:00</Time>}: serve para os dois horários.
          </Note></div>
          <OfferStrip where="passo2" />
          <div className="mt-6"><button type="button" onClick={goStep3} className={cx(BTN_P, "w-full sm:w-auto")}>Ver os passos<Icon n="chevR" /></button></div>
        </Step>

        {/* PASSO 3 */}
        <Step n={3} title="Programar o carregamento" state={secs[3]} headRef={h3} lockedText="Os passos aparecem aqui, já com o seu horário.">
          {G && <Guide {...{ G, b, f, v, p, cur, n, screen, photo, finished, go, finish, doneRef, copyLink, copied, linkUrl, carTitle }} />}
        </Step>

        <Promo />

        {/* Dicas */}
        <section aria-labelledby="t4" className="rounded-[1.75rem] border border-[#E7E4EC] bg-white p-5 sm:p-7 print:hidden">
          <h2 id="t4" className="text-xl font-black sm:text-2xl">Para tudo correr bem</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[["plug", "Um só horário", <>Programe o horário no carro <b>ou</b> na wallbox, nunca nos dois. Se tiver horários diferentes, o carro pode não carregar.</>],
              ["moon", "Confirme na primeira noite", "Ligue o cabo à noite e confirme na app que a carga começou à hora certa."],
              ["refresh", "Mantenha tudo atualizado", "Atualize a app e o software do carro. Os nomes dos menus podem mudar com as atualizações."]].map(([ic, t, d]) => (
              <div key={t} className="flex gap-3 rounded-2xl bg-[#F6F4F8] p-4 md:flex-col">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#40DDA6]/25 text-[#146B4F]"><Icon n={ic} /></span>
                <div><h3 className="font-black">{t}</h3><p className="mt-1 text-base leading-relaxed text-[#514D5F]">{d}</p></div>
              </div>
            ))}
          </div>
        </section>

        <Sources />
      </main>

      <footer className="mx-auto max-w-5xl space-y-3 px-4 pb-10 text-sm leading-relaxed text-[#514D5F] sm:px-6 print:hidden">
        <div id="notas" tabIndex={-1} className="scroll-mt-24 rounded-2xl border border-[#E7E4EC] bg-white p-4 focus:outline-none sm:p-5">
          <h2 className="font-bold text-[#171424]">Notas sobre o tarifário Carregar em Casa</h2>
          <p className="mt-1">*{OFFER.notaPreco}</p>
          <p className="mt-1">**{OFFER.notaDesconto}</p>
          <p className="mt-1">Condições completas em <A href={OFFER.pagina}>goldenergy.pt</A> e nos <A href={OFFER.precosPdf}>preços da oferta</A>.</p>
        </div>
        <p>Este guia é uma ajuda prática e não substitui o manual do veículo.</p>
      </footer>
      <div role="status" aria-live="polite" className="sr-only">{msg}</div>
    </div>
  );
}

/* Boas práticas: o foco e as âncoras não ficam escondidos pela barra fixa (WCAG 2.4.11) e o movimento respeita a preferência do sistema */
const PAGE_CSS = `html{scroll-padding-top:5rem;scroll-padding-bottom:6.5rem;-webkit-text-size-adjust:100%;text-size-adjust:100%}
@media (min-width:640px){html{scroll-padding-top:7rem}}
@media (min-width:768px){html{scroll-padding-bottom:1rem}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}`;
const ALL_CSS = DEVICE_CSS + PAGE_CSS;
const SELECT = "min-h-[52px] w-full cursor-pointer appearance-none rounded-2xl border-2 border-[#D9D5E0] bg-white pl-4 pr-11 text-base text-[#171424] hover:border-[#B9B3C6] focus:border-[#146B4F] focus:outline-none focus:ring-4 focus:ring-[#40DDA6]/35 disabled:cursor-not-allowed disabled:bg-[#F6F4F8] disabled:text-[#8C87A0]";
function Field({ id, label, opt, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">{label}{opt && <span className="font-normal text-[#514D5F]"> (opcional)</span>}</label>
      <div className="relative">{children}<span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#146B4F]"><Icon n="chevD" /></span></div>
    </div>
  );
}

/* ===================== Guia passo a passo ===================== */
function Guide({ G, b, f, v, p, cur, n, screen, photo, finished, go, finish, doneRef, copyLink, copied, linkUrl, carTitle }) {
  const { gk, g } = G;
  const desk = useDesktop();
  const last = cur === n - 1;
  const k0 = g.screens[g.screens.length - 1].k || g.k || "app";
  const where = k0 === "car" ? "no ecrã do carro" : k0 === "wb" ? "na wallbox" : "na app";
  const sub = b.other ? "Passos comuns à maioria das apps" : gk === "quad" ? "Quadriciclo · programa-se normalmente " + where : gk === "legacy" ? "Modelo anterior · programa-se normalmente " + where : (b.app ? "App " + b.app + " · " : "") + "programa-se " + where;
  const title = b.other ? "Guia geral" : b.name + " " + famLabel(b, f) + (v && f.versions.length > 1 ? " · " + (v.name.replace(f.name, "").trim() || v.name) : "");
  const oldNote = f && f.old && f.versions[0].note;

  /* Ao mudar de passo: o passo ativo fica visível e recebe o foco (sem saltos no primeiro carregamento) */
  const prev = useRef(cur);
  useEffect(() => {
    if (prev.current === cur) return;
    prev.current = cur;
    const el = typeof document !== "undefined" && document.getElementById("gs-" + cur);
    if (!el) return;
    try { el.focus({ preventScroll: true }); } catch (e) { }
    const r = el.getBoundingClientRect && el.getBoundingClientRect();
    if (r && (r.top < 80 || r.top > window.innerHeight * 0.6) && el.scrollIntoView) el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
  }, [cur]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b border-[#EEEBF2] pb-4">
        <BrandLogo b={b} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black leading-tight sm:text-xl">{title}</h3>
          <p className="text-base text-[#514D5F]">{sub}</p>
        </div>
      </div>

      <Prep b={b} k0={k0} />

      <div className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-[minmax(0,1fr)_288px]">
        {/* Passos: lista única; o passo ativo abre e mostra o ecrã */}
        <ol className="flex min-w-0 flex-col gap-2" aria-label={"Passos para programar, " + n + " no total"}>
          {g.steps.map((s, i) => {
            const isCur = i === cur, past = i < cur;
            return (
              <li key={i} className={cx("rounded-2xl border-2 motion-safe:transition-colors", isCur ? "border-[#40DDA6] bg-[#F3FDF9]" : "border-transparent")}>
                <button id={"gs-" + i} type="button" onClick={() => go(i)} aria-current={isCur ? "step" : undefined}
                  className={cx("flex w-full items-start gap-3 rounded-2xl p-3 text-left", FOCUS, !isCur && "hover:bg-[#F6F4F8]")}>
                  <span aria-hidden="true" className={cx("mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-black",
                    isCur ? "bg-[#146B4F] text-white" : past ? "bg-[#40DDA6] text-[#171424]" : "bg-[#EEEBF2] text-[#514D5F]")}>
                    {past ? <Icon n="check" className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={cx("min-w-0 flex-1 text-base leading-relaxed", isCur ? "text-[#171424]" : "text-[#514D5F]")}>
                    <span className="sr-only">Passo {i + 1} de {n}: </span><Rich text={s} b={b} p={p} link={false} />
                  </span>
                </button>
                {isCur && (
                  <div className="px-3 pb-4 sm:pl-[3.25rem]">
                    {/\{app\}/.test(s) && b.app && storeUrl(b.app) && (
                      <p className="mb-3 text-sm text-[#514D5F]">Ainda não tem a app <AppName name={b.app} />? Instale-a a partir da {STORE_NAME}.</p>
                    )}
                    {desk !== true && <div className="mb-4 md:hidden print:hidden">
                      <PhoneMock key={gk + screen} g={g} b={b} p={p} gk={gk} screen={screen} family={f} photo={photo} />
                    </div>}
                    {last
                      ? <button type="button" onClick={finish} className={cx(BTN_P, "w-full sm:w-auto print:hidden")}>Já programei<Icon n="check" /></button>
                      : <button type="button" onClick={() => go(i + 1)} className={cx(BTN_P, "w-full sm:w-auto print:hidden")}>Passo seguinte<Icon n="chevR" /></button>}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* Ecrã da app ao lado, no computador */}
        {desk !== false && <div className="hidden md:sticky md:top-28 md:block md:self-start print:hidden">
          <PhoneMock key={gk + screen} g={g} b={b} p={p} gk={gk} screen={screen} family={f} photo={photo} />
        </div>}
      </div>

      {finished && (
        <div ref={doneRef} tabIndex={-1} className="mt-6 rounded-2xl border-2 border-[#40DDA6] bg-[#E6FAF2] p-5 focus:outline-none sm:p-6">
          <h4 className="flex items-center gap-2 text-lg font-black text-[#146B4F]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#40DDA6] text-[#171424]"><Icon n="check" className="h-4 w-4" /></span>Está programado</h4>
          <p className="mt-2">Hoje à noite, ligue o cabo e confirme na app que a carga começa perto das <Time>{p.s}</Time>.</p>
          <p className="mt-1 text-[#514D5F]">Se não começar, reveja os passos ou programe o horário na wallbox. Use só um dos dois.</p>
          <ShareGuide linkUrl={linkUrl} carTitle={carTitle} copyLink={copyLink} copied={copied} />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {g.tip && <Note><Rich text={g.tip} b={b} p={p} /></Note>}
        {oldNote && <Note>Modelo anterior ({f.versions[0].note}). Se a app já não funcionar, use o horário da wallbox.</Note>}
        <details className="group rounded-2xl border border-[#E7E4EC] bg-white print:hidden">
          <summary className={cx("flex min-h-[52px] cursor-pointer list-none items-center gap-3 rounded-2xl px-4 font-bold text-[#171424] [&::-webkit-details-marker]:hidden", FOCUS)}>
            <Icon n="bolt" className="h-5 w-5 text-[#146B4F]" /><span className="flex-1">Ajustar a potência de carregamento <span className="font-normal text-[#514D5F]">(opcional)</span></span>
            <Icon n="chevD" className="h-5 w-5 motion-safe:transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-2 px-4 pb-4 text-base leading-relaxed text-[#514D5F]">
            <p><Rich text={g.power} b={b} p={p} /></p>
            <p>Só é preciso se a instalação elétrica não aguentar a potência máxima. Com uma wallbox com balanceamento dinâmico, normalmente não precisa de mexer nesta definição.</p>
          </div>
        </details>
      </div>

      <Feedback gk={gk} b={b} f={f} />
      <p className="mt-4 text-sm text-[#514D5F]">Guia revisto em {REVISTO}. As apps mudam com as atualizações; se encontrar um nome diferente, procure a opção mais parecida.</p>
    </div>
  );
}

/* Antes de começar: o que é preciso ter pronto */
function Prep({ b, k0 }) {
  const app = b.app ? <AppName name={b.app} /> : b.other ? "da marca" : "oficial da " + b.name;
  const items = k0 === "car"
    ? [<>Este horário programa-se no ecrã central do carro. Não precisa da app.</>,
       <>Faça-o com o carro parado e o ecrã ligado.</>,
       <>Tenha o cabo à mão para confirmar no fim.</>]
    : k0 === "wb"
      ? [<>A app da wallbox instalada no telemóvel, com sessão iniciada.</>,
         <>A wallbox ligada à internet (Wi-Fi ou rede móvel).</>,
         <>Um só horário: se usar o da wallbox, desligue o do carro.</>]
      : [<>A app {app} instalada no telemóvel, com sessão iniciada.</>,
         <>O carro associado à sua conta na app.</>,
         <>Os serviços conectados ativos. Em algumas marcas, ativam-se no ecrã do carro ou no concessionário.</>,
         <>O carro com rede móvel. Numa garagem subterrânea, as alterações podem demorar a chegar ao carro.</>];
  return (
    <div className="mt-5 rounded-2xl bg-[#F6F4F8] p-4 sm:p-5">
      <h4 className="font-black text-[#171424]">Antes de começar</h4>
      <ul className="mt-2 space-y-2">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2.5 text-base leading-relaxed text-[#514D5F]">
            <span aria-hidden="true" className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white text-[#146B4F]"><Icon n="check" className="h-3.5 w-3.5" /></span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Enviar o guia para o telemóvel (computador) ou partilhar (telemóvel) */
function ShareGuide({ linkUrl, carTitle, copyLink, copied }) {
  const [native, setNative] = useState(false);
  useEffect(() => {
    try { setNative(!!(navigator.share && window.matchMedia && window.matchMedia("(pointer: coarse)").matches)); } catch (e) { }
  }, []);
  const title = "Guia Goldenergy: carregar " + (carTitle ? "o " + carTitle + " " : "") + "nas horas de vazio";
  const url = linkUrl();
  const share = () => { track("guia_partilhar"); try { navigator.share({ title, url }).catch(() => { }); } catch (e) { } };
  const mail = "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent("Passos para programar o carregamento:\n" + url);
  const wa = "https://wa.me/?text=" + encodeURIComponent(title + "\n" + url);
  const COPY = <button type="button" onClick={copyLink} className={BTN_G}><Icon n={copied ? "check" : "link"} />{copied ? "Ligação copiada" : "Copiar ligação"}</button>;
  return (
    <div className="mt-5 border-t border-[#40DDA6]/50 pt-5 print:hidden">
      {native ? (
        <>
          <p className="font-bold text-[#171424]">Guarde este guia para a próxima vez</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={share} className={BTN_BLUE}><Icon n="share" />Partilhar este guia</button>
            {COPY}
          </div>
        </>
      ) : (
        <>
          <p className="font-bold text-[#171424]">Enviar para o telemóvel</p>
          <p className="text-base text-[#514D5F]">Assim tem os passos à mão quando estiver junto do carro.</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={mail} onClick={() => track("guia_enviar_email")} className={BTN_BLUE}><Icon n="mail" />Enviar por email</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track("guia_enviar_whatsapp")} className={BTN_G}><Icon n="chat" />Enviar por WhatsApp<Ext /></a>
            {COPY}
          </div>
        </>
      )}
    </div>
  );
}

/* Este guia ajudou? Respostas fechadas, sem dados pessoais. Enviadas para o Google Tag Manager (evento guia_feedback). */
const MOTIVOS = ["Os menus têm outro nome", "Não encontro a opção na app", "O carro não carregou no vazio", "Outro motivo"];
function Feedback({ gk, b, f }) {
  const [ans, setAns] = useState(null), [motivo, setMotivo] = useState(null);
  const send = (resposta, m) => { try { (window.dataLayer = window.dataLayer || []).push({ event: m ? "guia_feedback_motivo" : "guia_feedback", resposta, motivo: m || "", marca: b.other ? "outra" : b.name, modelo: f ? f.name : "", guia: gk }); } catch (e) { } };
  const pill = cx(BTN_G, "min-h-[44px] px-5");
  const done = ans === "sim" || motivo;
  return (
    <div className="mt-6 rounded-2xl border border-[#E7E4EC] bg-white p-4 sm:p-5 print:hidden" aria-live="polite">
      {done ? (
        <p className="flex items-center gap-2 font-bold text-[#146B4F]"><Icon n="check" />{ans === "sim" ? "Agradecemos a resposta." : "Agradecemos a ajuda. Vamos rever este guia."}</p>
      ) : ans === "nao" ? (
        <fieldset>
          <legend className="font-bold text-[#171424]">O que correu mal?</legend>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {MOTIVOS.map(m => <button key={m} type="button" onClick={() => { setMotivo(m); send("nao", m); }} className={cx(pill, "justify-start sm:justify-center")}>{m}</button>)}
          </div>
        </fieldset>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="flex-1 font-bold text-[#171424]">Este guia ajudou?</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => { setAns("sim"); send("sim"); }} className={cx(pill, "flex-1 sm:flex-none")}>Sim</button>
            <button type="button" onClick={() => { setAns("nao"); send("nao"); }} className={cx(pill, "flex-1 sm:flex-none")}>Não</button>
          </div>
        </div>
      )}
    </div>
  );
}

const Note = ({ children }) => (
  <div className="flex gap-3 rounded-2xl bg-[#FFF6E5] p-4 text-base leading-relaxed text-[#4A3500]">
    <Icon n="info" className="mt-0.5 h-5 w-5 flex-none text-[#7A4B00]" /><p>{children}</p>
  </div>
);

/* ===================== Fontes e notas ===================== */
function Sources() {
  return (
    <details className="group rounded-[1.75rem] border border-[#E7E4EC] bg-white [contain-intrinsic-size:auto_80px] [content-visibility:auto] print:hidden">
      <summary className={cx("flex min-h-[56px] cursor-pointer list-none items-center gap-3 rounded-[1.75rem] px-5 font-bold sm:px-7 [&::-webkit-details-marker]:hidden", FOCUS)}>
        <span className="flex-1">Fontes e notas</span><Icon n="chevD" className="h-5 w-5 motion-safe:transition-transform group-open:rotate-180" />
      </summary>
      <ul className="list-disc space-y-2 px-5 pb-6 pl-10 text-sm leading-relaxed text-[#514D5F] sm:px-7 sm:pl-12">
        <li>As imagens das apps são ilustrações simplificadas, com as cores e os nomes dos menus de cada app. Não são capturas de ecrã oficiais e podem variar com a versão da app ou do software do carro.</li>
        <li>Nomes dos menus e funcionamento, a partir de manuais e páginas oficiais dos fabricantes: <A href="https://www.tesla.com/ownersmanual/modely/en_us/GUID-76995CEC-6402-4BFF-99FA-CEFA36E64A19.html">manual Tesla</A>, <A href="https://www.user-manual.renault.com/pt/content/openr-link/veiculo/veiculo-eletrico">manual Renault em português</A>, <A href="https://faq.bmwusa.com/s/article/My-BMW-App-Charging-Charge-Climate-Timer-Charging-mode-Charge-in-time-frame-rlLVj?language=en_US">perguntas frequentes da My BMW App</A>, <A href="https://www.bmw.pt/pt/veiculos-eletricos/home-charging.html">BMW Portugal</A>, <A href="https://www.volkswagen.pt/conectividade-e-mobilidade/vw-connect-id/conforto">Volkswagen Portugal</A>, <A href="https://www.peugeot.pt/conselhos-sugestoes/eletrificacao/carregamento/como-encontrar-pontos-de-carregamento-publicos-para-um-carro-eletrico.html">Peugeot Portugal</A> e <A href="https://www.media.stellantis.com/pt-pt/peugeot/press/abertas-as-encomendas-para-a-versao-eletrica-do-furgao-mais-vendido-em-portugal">Stellantis Media</A>.</li>
        <li>Kia e Hyundai: nomes dos menus do <A href="http://webmanual.kia.com/DA_GEN2_V/AV/EUR/Portuguese/002_Features_electricvehicle.html">manual oficial Kia em português</A> (Gestão de carregamento, Carregamento planeado, Corrente de carga CA). Nomes atuais das apps confirmados no Google Play em novembro de 2026: <A href="https://play.google.com/store/apps/details?id=com.kia.oneapp.eu&hl=pt_PT">Kia App</A> e <A href="https://play.google.com/store/apps/details?id=com.hyundai.oneapp.eu&hl=pt_PT">myHyundai</A>.</li>
        <li>Marcas, modelos e versões: <A href="https://ev-database.org/">EV Database</A> (novembro de 2026), mais modelos anteriores, comerciais e quadriciclos comuns em Portugal.</li>
        <li>Logótipos: <A href="https://github.com/filippofilip95/car-logos-dataset">car-logos-dataset</A>; as marcas pertencem aos respetivos fabricantes. Fotos dos modelos: Wikimedia Commons, via Wikipédia, com licenças livres (autoria na página de cada ficheiro), e EV Database quando não existe foto livre.</li>
        <li>Tarifário Carregar em Casa: condições e preços publicados em <A href={OFFER.pagina}>goldenergy.pt</A>. As notas sobre o preço estão no fim da página.</li>
        <li>Ilustração: campanha «Electric Love» da Goldenergy.</li>
        <li>Custo aos 100 km: {CUSTO100_CALC}. {CUSTO100_NOTA}</li>
        <li>Ciclos de vazio: horários de referência das tarifas bi-horárias em Portugal continental. Confirme sempre o seu contrato. Novos horários a partir de 2027: <A href="https://www.erse.pt/media/uhpieyio/comunicado_novos-per%C3%ADodos-hor%C3%A1rios-_vfinal31julho2026.pdf">comunicado da ERSE</A>.</li>
      </ul>
    </details>
  );
}

/* ===================== Oferta: faixa no passo 2 ===================== */
function OfferStrip({ where }) {
  return (
    <div className="mt-5 rounded-2xl border-2 border-[#40DDA6] bg-white p-4 sm:p-5">
      <p className="text-sm font-bold uppercase tracking-wider text-[#146B4F]">Tarifário Carregar em Casa</p>
      <p className="mt-1 text-xl font-black leading-tight text-[#171424]">Carregue no <Vz /> a <span className="whitespace-nowrap text-[#382F83]">{OFFER.preco}*</span></p>
      <p className="mt-1 text-base text-[#514D5F]">Já é cliente de eletricidade Goldenergy? Tem <b className="text-[#171424]">{OFFER.descontoClientes} de desconto</b> no <Vz />.**</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <a href={utm(OFFER.adesao, where)} target="_blank" rel="noopener noreferrer" onClick={() => track(where + "_aderir")} className={BTN_BLUE}>Aderir ao tarifário<Ext /></a>
        <a href={OFFER.telefoneHref} onClick={() => track(where + "_telefone")} className={BTN_G}><Icon n="phone" />Ligar {OFFER.telefone}<span className="font-semibold text-[#514D5F]">(grátis)</span></a>
      </div>
      <p className="mt-3 text-sm text-[#514D5F]"><a href="#notas" className={LINKBTN}>*Condições no fim da página</a></p>
    </div>
  );
}

/* ===================== Custo aos 100 km com explicação ===================== */
function Cost100() {
  const [hover, setHover] = useState(false), [focus, setFocus] = useState(false), [pin, setPin] = useState(false);
  const open = hover || focus || pin;
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = () => { setHover(false); setFocus(false); setPin(false); };
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) close(); };
    const onKey = e => { if (e.key === "Escape") close(); };
    document.addEventListener("pointerdown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const isKbd = el => { try { return el.matches(":focus-visible"); } catch (e) { return true; } };
  return (
    <div ref={ref} className="relative mt-6 max-w-xl">
      <div className="inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-white/75 py-2 pl-4 pr-2">
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1"
          onPointerEnter={e => e.pointerType === "mouse" && setHover(true)} onPointerLeave={e => e.pointerType === "mouse" && setHover(false)}>
          <span className="text-base font-semibold">Gaste apenas</span>
          <b className="text-2xl font-black tabular-nums text-[#382F83]">{CUSTO100}</b>
          <span className="text-base font-semibold">aos 100 km, a carregar no <Vz />.</span>
          <button type="button" aria-label="Como calculámos este valor" aria-describedby="tipCusto" aria-expanded={open}
            onClick={() => setPin(v => !v)} onFocus={e => isKbd(e.currentTarget) && setFocus(true)} onBlur={() => setFocus(false)}
            className={cx("flex h-11 w-11 items-center justify-center rounded-full text-[#382F83] hover:bg-white", FOCUS)}>
            <Icon n="info" className="h-6 w-6" />
          </button>
          <span id="tipCusto" role="tooltip"
            className={cx("absolute left-0 right-0 top-full z-30 pt-2", open ? "block" : "hidden")}>
            <span className="block rounded-2xl bg-[#171424] p-4 text-left text-sm leading-relaxed text-white shadow-[0_16px_40px_-12px_rgba(23,20,36,.5)]">
              <b className="block text-base">Como calculámos</b>
              <span className="mt-1 block font-semibold tabular-nums text-[#40DDA6]">{CUSTO100_CALC}</span>
              <span className="mt-1 block text-white/85">Preço do vazio do tarifário Carregar em Casa. {CUSTO100_NOTA}</span>
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}

/* ===================== Promoção: tarifário + solar ===================== */
function Promo() {
  return (
    <section aria-labelledby="tpromo" className="scroll-mt-20 sm:scroll-mt-28 print:hidden">
      <h2 id="tpromo" className="sr-only">Mais para a sua casa</h2>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {/* Carregar em Casa */}
        <article className="flex flex-col overflow-hidden rounded-[1.75rem] bg-[#40DDA6]">
          <div className="flex flex-1 flex-col p-5 sm:p-7">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white"><Moon className="h-6 w-6" /></span>
            <p className="text-sm font-bold uppercase tracking-wider text-[#382F83]">Tarifário Carregar em Casa</p>
            <h3 className="mt-1 text-2xl font-black leading-tight text-[#171424] sm:text-[1.75rem]">Um tarifário pensado para carregar o carro em casa</h3>
            <p className="mt-3 text-[1.05rem] text-[#171424]">Preço no <Vz />: <b className="whitespace-nowrap">{OFFER.preco}*</b>, em tarifa bi-horária.</p>
            <ul className="mt-3 space-y-1.5 text-base text-[#171424]">
              {["O carro carrega à noite, sem mudar a rotina", "Para clientes de eletricidade Goldenergy: " + OFFER.descontoClientes + " de desconto no vazio**", "Adesão online ou por telefone"].map(t => (
                <li key={t} className="flex gap-2"><span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#171424] text-[#40DDA6]"><Icon n="check" className="h-3 w-3" /></span><span>{vzText(t, "p")}</span></li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row sm:flex-wrap">
              <a href={utm(OFFER.adesao, "promo")} target="_blank" rel="noopener noreferrer" onClick={() => track("promo_aderir")} className={BTN_BLUE}>Aderir ao tarifário<Icon n="arrow" /><Ext /></a>
              <a href={OFFER.telefoneHref} onClick={() => track("promo_telefone")} className={cx(BTN, "border-2 border-[#171424] text-[#171424] hover:bg-white/30")}><Icon n="phone" />Ligar {OFFER.telefone}</a>
            </div>
            <p className="mt-3 text-sm text-[#171424]">Chamada gratuita · {OFFER.horario}</p>
          </div>
        </article>

        {/* Painéis solares */}
        <article className="flex flex-col overflow-hidden rounded-[1.75rem] border-2 border-[#FFC845] bg-[#FFF8E1]">
          <div className="flex flex-1 flex-col p-5 sm:p-7">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC845] text-[#171424]"><Icon n="sun" className="h-6 w-6" /></span>
            <p className="text-sm font-bold uppercase tracking-wider text-[#7A4B00]">Painéis solares</p>
            <h3 className="mt-1 text-2xl font-black leading-tight text-[#171424] sm:text-[1.75rem]">O sol também pode dar energia ao seu carro.</h3>
            <p className="mt-3 text-[1.05rem] text-[#171424]">Com painéis no telhado, a casa produz energia durante o dia. Essa energia serve para a casa e para o carro, quando está em casa.</p>
            <ul className="mt-3 space-y-1.5 text-base text-[#171424]">
              {["Quando o carro está em casa de dia, carrega com o sol", "Nos outros dias, carrega à noite, no vazio", "Equipamento, instalação e acompanhamento pela Goldenergy"].map(t => (
                <li key={t} className="flex gap-2"><span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#FFC845] text-[#171424]"><Icon n="check" className="h-3 w-3" /></span><span>{vzText(t, "s")}</span></li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
              <a href={utm(OFFER.solar, "promo")} target="_blank" rel="noopener noreferrer" onClick={() => track("promo_solar")} className={BTN_SOLAR}>Conhecer os painéis solares<Icon n="arrow" /><Ext /></a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
