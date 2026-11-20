/*
 * Goldenergy · Guia de carregamento programado — MOTOR (dados + ilustrações)
 * Sem React: só dados e geração de HTML das maquetas.
 *   1. Dados: marcas/modelos/versões (EV Database), fotografias, guias por app (texto-fonte em PT) e temas das apps
 *   2. Motor das ilustrações do telemóvel (CSS isolado em .gm)
 * As traduções dos guias e das maquetas estão em src/i18n/*.json (chave = texto PT).
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
@Alpine|alpine|My Alpine
#A290
2268 A290 Electric 180 hp
2269 A290 Electric 220 hp
#A390
3390 A390 GT
3391 A390 GTS
@Audi|audi|myAudi
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
@Bentley|bentley|My Bentley
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
@Citroën|citroen|MyCitroën
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
@CUPRA|cupra|My CUPRA
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
@Denza|byd|DENZA
#Z9GT
3730 Z9GT 122.49 kWh AWD
@Dongfeng|cn|
#Box
3035 Box 31.4 kWh
3036 Box 42.3 kWh
@DS Automobiles|ds|MyDS
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
@Fiat|fiat|FIAT
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
@GWM|gwm|My GWM
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
@Hyundai|hyundai|myHyundai
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
@Jeep|jeep|Jeep
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
@Kia|kia|Kia
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
@Leapmotor|leap|Leapmotor
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
@Lexus|lexus|Lexus Link+
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
@Lotus|lotus|Lotus Cars
#Eletre
3216 Eletre 600
3217 Eletre 900
#Emeya
3214 Emeya 600
3215 Emeya 900
@Lucid|lucid|Lucid
#Air
3271 Air Pure RWD
3272 Air Touring
3273 Air Grand Touring
3274 Air Sapphire
#Gravity
3291 Gravity Touring
3292 Gravity Grand Touring
@Lynk&Co|lynk|Lynk & Co
#02
3045 02
@Maserati|maserati|Maserati Connect
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
@Mini|mini|MINI
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
@Opel|opel|MyOpel
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
@Peugeot|peugeot|MyPeugeot
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
@Škoda|skoda|MyŠkoda
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
@Zeekr|zeekr|ZEEKR
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
@SEAT|seat|My SEAT
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
const LOGO = "data:image/webp;base64,UklGRuIcAABXRUJQVlA4TNYcAAAvQ0JYEN8xIyM1mQzbtnEcPMm++14C4z9+/PgRPChuFMWOiWIHEMVEERRFIQIwUUyAYMOCEBMiEEIAUAQBEACIAARCADHhbQDYvG2DawNIHiU8ibrK2iWvtet6auN6k52eniOdzMT//2VxBBKEmGRfFtH/CYC3euPbfni+WzmE8nWr9fD82HoL74W2m2j+0WPJoO9p/rS17wHuQBHDFksFm0ARzzdvfeaBIoemTO4DRT7YNz0fKP7JlAc+UML7N7wNJQ22NOyFkm7e7DaU2peFDZT4hG9zG0rvSsIGSr5/k7sngcGUA15IYPcG50jkqRweSOTN29sog5pSuCeZF3xra0iqKQMMQqh7Y8MgZlsGDYk1b2sNyTUlgEHO9m1tEtSUgCe5Ad/SHAmeSuAsiPxb2loS2eVDkty/pT2KqpfPiwpvaEii++VbiyL7duZkTcs3yKrezmpZtHxBVvt21gozi0ey1+8VrqyG//z3n//+899//vvPf/+pzbhV2w9DoKthGIZ16917hPPtehge6fo0DMe2rRwun/HrgaJPfW3Lx7mqfd4P67Zt25Vz5pXiVv1E0S/HlcPlqtYTJQ+7qlSMW/UDRZ6Gde1eFabuSeCxtktU7QIJDVubDP16CPR8OrbVErhVHyj9486bV4GpzyR2rM2ymC6Q6INL4ntihp1TzdR9ILnTuio9fyDhvVsOdyD5BxfNjxTz4LQy9ZnEh95jsWEzUYYHtwz+THluMYp5oNh7VAj9mTINO1dk2ATK9OD0c0fK9nITwQeKf7nRxu0o67HG0sImUMZb1M08UNZ75HSU1qtSHSj/rSmq+0B5X24Uw4ZyP9t5G0rt9fAj6bg1xeTOlP8etXIj5R9u5mwovdeiupCaW1NE2JGKo1UJO9LRv+RJolUC8D5oQbTF8nEjaXmvkP1/pKW/ZknkiEoAYKMGhaZ0GlJ0o44nRf0zHGVQpwaAedCCaHQlgw+03AI2pKoHgBVJNXoA3KtB1GGx2AuVC55I2RswJHarCdhRDRpdoXha9FR2JG2D3cohownggxpEXZE0VDA2kL4TCe5ycSYKwEYPOpny2FDB2EDLPmWyIZp2HiNApweFm9LYUMHYQEtvc8ATXd85Hng9iJqy2FDB2ECLX2dgLzRz9CzoFKFNSWyoYGyg5e/l+UDzR8eBjSJ0wmLYUMHYQAX4KM4Tf48MeFCETlgIGyoY/H9UhNLuKeblhoGjInSxReCpZE5UYBuK3M0DqwkFWwCOSmZDhehEbSj6Zh7ca0LBLp4NJeOpwBpKeMJZ8KAJBbtweKaCsVRgnpKecJYJmlAwy7ahgsGxwDwl3syCRhU64ZJ5Kpk9lZej5N0sGFWh04LZUDI3VF42pKObWV4X2izXmQoGL+WFZxIYzBwYdaH7pWqoZPZUXnsS+TDLK0N2mSyVzA2VV0NC/RwIylyW6VAyOJaXI6kjzumUoUXyVDINFReOYqiZY5R5XCK8lIwJ5bUnuQFnwFmX9RI1VDJbKq4bkuzn1LpUC2SoZAwVF15EnedYVQIs0LZoHsprS7LtDAia7BbIUMk4Ki5Hwldzek3cAm2Lpi+vs7TznJUiIyyPoZIxVFz3JH6OU8Qv0LZotsWFQZ6bYfQYYXkMlQxS5n9//lg5h2Cdu/v47WkRGpJfzwA9bhaoye3bxzvnLKBz1cfPf6vTZPX1FoFr21/qYchgPefxyuOwa5/vhpDLA8w1SxFy+tVa4OLtV12mfH7eIcR1X5VrKMNhzuFx7S3Md3Uf5AUzB5/MMnjK96uDuHj3U4+Kcn26hYTmT80wZBbbdUGYh7kNbZfhkM2fBhLePmnR59IipHU/9WpIJQD0Z0kbmIuBAi6BoUx/VpAWWx2Q8nxykBy/qBW0AoCbUcwJZzVE1CxBl8kXhOTuSQOfxw8DEu+U8qQYgL/IOCHMNUREYQmmPO5AovmhwDmLPxFk3up01g2wk3BCmP3wjLx+lrK8BZn4IztDOX4BsbcaWcqzkwPgxmQnhNn3dPWgX5fFLYj9Mzefww+UA7cKbfPwIBofEu0RZptwjYx6Uw63IBd/ZNZn8BNB8p0+IYfgQPomSQPME73YaWcpww8gGX/mRRlakP1Fm4oyDBbkN/FGB8wNvTxpV2fwBWTbrKoM7kA4/lRml0GwkGMXq0Ng3tNcq9xR3hMKg7uc1vL+BPFOmSAvWMhzE2VrgOtpdqccya9AfJ/RozwjD76oUpH4YCHXDStsDbA9zZ90c/K+gHybD5L4FjI0/2iyk+ch34d5vUfge+Ja1VbyTAbwKRsn7glzgA+aTOI6yBgv16bjykFUT+xataO4T5AjPuWyEvcBssQnPQxJP0PWxjnnIH5H/KNqJN5kAR9yOYozecAnPWpxNq+0+EAxNbPiPkGeJpcg7TNkavTopTWgthspqlPMi7OZwOc8DEl3uUCvxiQsoFbYUOSVYmtpf0GuLg8n7Rdke6uFIeENKO1Git0rNki7ywZ+ZbGS1uaDWlTCJtDZ7Cn+pFiQhvm0Weyk2XzgqxKtsEYls6WkqBaS8L8gX5fFIOwJMr5T4igroELVgRI7tZy03zKCpxyCsK85WSUmWTvQ1nYTJV+p5aXZnL7mQMLvcoInHUh2pYr1u0AS12q10iDnuwyMNJfVNxWsrABKmrbtBxI7qLUW9j0rl4GTBll/VMHJ2mmBJHpSaxD2e1ag3t95VSrUsrwW8CiKCuE2r7/lrYR9zcuq0MoyaqyL4P8Lc3l9k9cK+5gXqLAWFUBNL8tpRcIxr4/a/bZ8g6hBD1NgUDQus+9Ls9YDyutXZpW842umVWQS5ZVCYd8zc/KG10ylyCCqVcq9JmxmnzV4FOXeKyDzjxrQm5j5Vwj8K8RoZzL7XYPHNzGnncvsuwbDv25WikyivFKmbHavmbUiJNopBcKGpWmF3Wb2a2kGPWx5UWa/afcxM9JgLSroURUY5vVRu895GRVaUYRqtLJQqyDM5fVNnhf2PS+nwkpWpcZRFmg1CLvN6295TthTXncqOFk7NUj0VAgf8yLtCLP6fWHC0P9vLSpZg1prYd+ychmgtCqrv1UAGaFfOQRFd7J2arXCnrK6ywCkfcyKdJjSTZ0DZZFkr9Tywsjm9DWHSdi3nJwSx1R9BfrWwpxaTtpdTk85DMIIM2qVaNNsDWg8CjNqobRvGVnKYSetyuhvJXyKrQGVHckOoBZII8ynzWIl7XM+hpQw8Q4WlD4IOyo2SLvN51cWTtpTPndaQIgU7kFrT8JXiq2l9dlYysJIo9tsfqrRxzkZ0BpHaU6xWhqZXD7lAeL6XBypUUfpQO+GpKNiTtynTJAyGaSRyeSrHjaGB70tST+CYiDuCfP4kMta3Kc8DOkBgRUsRHX1bpjoeZMTjuJWqg3S6EMW+JSLF0cmi0+a7DjBAh99T7NdRnsSb1Vbi/vH5PCBcjHyvuTgSBPPCBbYbkfcYLNpSHwA1Spx9CkDQ9lAEEcug14VnBcscN2BIo6YiSf5O91QHjl5f2bUy/uJ4u5IFejnBAtMs6e4J8zCU4aVbnCU9xOl3VFGtTxqpZl/lPFzboB5Hyj2CTPwlGEA5Vby6A9h9p+cTAZUycIfpAyGlxqYj3tKeLHi7inHTjubAd2Kwr8oJ5gyeLKi/iBtYPfCA8y3Z0oaboRtKEurHUwZkJP0hfJaZ0BPKKglfdy1C86zgVI3ksyZsjyDel0OT1bOH5RZlQP9QDG3pBCMV25gtg2U/mzlOMrT62dzoCcr5Q/KDUIO9NMK+YNU8s8eYLYNJLJB1QLqB1MORLci8E/Kb5cFPTkJ+IV0wkBEZpYNJHT0mnWwAF0e1AqwP0mBKg+iD+nsT1IKGqItzMWR5IYG1TJLYDOhv2yqD5T1SxAyob9cGmwp7zQYyMx6INm7SqctLAGcMyH6ZFJUP0mJbS5EvYuHH55IMdhuYe49ye9rx8Fq/egyM8vgsyH6ZGLd9pT7DJsPUX+LUWz7RNknQjPHhAyeT8O6bb1v27YfJiIiPwNy2MIyYMiH6K87w3PtE+U/A8aMiOjrnZ2H1e+/SMNE8/ekZTsnZGAWArqciOjX59+cu4Ku+vjtiVSc4/N6/v3bx6ufv/8iLeU4UnM35yhvC0thMtN5DobsNJZz0GOYsxIXzGLAtmSgKzdLis5x4hpYDls0pty2mtgZEISNsCBwKBnYlhqSpvWcnTC3KK5oTKl5Vfo5law9LArsSwa2hdarEubAJOmCC2OKxhRaUIWqOY2kG1gY6EoGuiKzpOtuDgY5G1gcDCWDocRqZQhnQCPmjMsD9yUD928A9RwYhQQLCwTnkoFzgcFJmXGWE+JhkWzRuBIzQRfyc6ATsYFlgqZkoCswsEGXcRaeBTzAUsG5ZHAsMPC6kJ8DNiQ74XLZkgFbYuB1ueAcuEkVDCwX3JcM1CUGG1WomwU+TbCwZLAvGdiXGGxUITsLfIpgYdlwLBkcSww2qow4C3y8YGHhwIaCARtKDDaa0GYe2BApWFDMCgFfCLs4cFNksNGE/DwwD1GCBdkrYSD2vgzaSOCLDDaakJ0H0EQIFoQ7WUEObIrAxwJfZOA1CYYB5oEzWpBuZB0FwaYEXDTwOoWjcuCDHnRCBoA7zDohyA+iWkmwKQBI6FXyrXZgL3rQCTkAdhte2ECOO1GVKNgs3jEFeIU2oB/ggx50QhYAVLuJKHjI0ksKIHyzdHUS8OqcAI76AXR60NlGAADjLOSJQdBOGmw0+keSSQM26HJCgEGYzQPcRQ0KNkrGW0FOHGz0ORlBPaQ2J01OCPIgV9yrQXSvipFzgAy9NieErRyXDKDT44SwHAA3FzVoj4rAVozLAVxQ5YIAJkg5gMSbixJ7hOfTUgBu1aDLjSImCNlDnuakSLAAAPdSrAjAvQoNXKfFAHBnLYj2Rg24l3HBTAA6NYKFq3sZDUh1Y3ajgzxCXgD+ogVRh1rAXsQN5OsuOpwMXMdRwgkENyGvDuFFJ2zIDbAJWlDYoBJ4EtBAzrjX4ITwsg3pRpQE2IR8Dg5mVgsDgE1Q4uBASzwl20DmbsxuA7NtSBUsCMcm5DHewOxWWK8AANajAr0DRfGUqIP8m5BV8MC0lzSjhQz9Wd7BAbMX1qoAAP6QV+gM6Ir7FMGDhrjN6MEAGx9SPCDkabpJ0vQ/BtjTMgGYbsrm4BH0vQ/RHgwoabaZhHuI2kQL95CxXZ1lnFcWIiIJr/QAgGoXMjjXBnTGLs7oQVHThQzWCJHNNs7WQOZYtceQIhzbCiFuJc2pAgCuexTV1wYUx2Zi9RUoi/4sbGsgoekCZ2oM6Ghc3R6Hx3nD0Le1M5BwLQ0UNn79KCEcVw70t3X/eC0M6wpBY9tNYsYaIbVbHadrj31tYdEnYUGjq65eDyHa47GtDLwi7eosYOoslLQl4YNa163zbdseh+u7tl05Z+A1ilV7DPEed95AYXfS1sq9so2r2+MwzJiGYdd6ByU+Savfkl6RFUl3/0o4iIN/IzqS/vivhIO49b8RPIn37z1VexyG4bj2VhG8yDPvOmYbaObUWS0eSPwjvOOaLbFHjxo0JH/9jnMfKGZoMDtPGVbvNrih2KHBvDxlGOC9Fk+UMDSYkaccd+81eKK0oTO5dJRl9V7zQOm3Jgd7piwDvNN2JLKvpGFDmW7faRxJHWsjyY+Uq32fwVEMER28kWGaQNmOkCk6t2qf3zgjCau2bSuMgK5qn9fOZmZd3T6vnRNl67atLc/6tm0rI8S5Vdu2be1MBOvbtrZRbN223ohxq7atcE5Dws8rl8rUZ8rZ52BXx0DzjysrA7d0fYuz0O8mmn1c2TyM3z3S/MedRxl+pKtnN8t0E10/uFSm7ieaG3YeZ/mRro43rJuRrh6siPtAz0OHL2CQ9nxYexcHXb2bKO+A4mw3UdTQ2XT2Qi9f7Euup5hTY6ShP1Pc3gvY0MzuJbOl2V0KU48Uc2tfwAea2TE6ejl4ARt6+Wyveco2DMe2bdvKOedWbdseh0AKNiDcHyjhwSXCC8294JWbkaJvjSSzDRQ/NJioo9n+WkPcLprZUvSDu/JAs+9nNTT7JtmG5p7xyjkfpY0sd6bEB5tkS/O3AGAPlLQRg1tKHO6TOJofEADwgfgujtlS0i0CeJofzAxD8y+YyNH85pmhstyCZNyTwCYBEhfhnlKfrYz7QOnPNsGOQTWAvVDEPsp9oMSXGzgzqJlRM6hJdGCEZ1VhGEk3FxJ5ttEq1v2e0gcvAB9I5n28wDmCDRQ1Aj6QwI64w4wjZ0pjiGsBoC2LBgQ3JDXcxGpZQn0yeyGpG4xkiG0DxXUsO1KWMwYO2SQ1ywFAXxQBBW1IsNeEfCIfSO4J4zjehWT8r0DKdEnOUYaiuAexeCDRXhPySTyJPqGM6BxPuc7oWVMKQ2wsjTPIfSDhXhOyCTwJP2FOZp6j/GoW2QQ1a4LScHI2JP5GkxGjORK/z2iE2TYoYHldgjNr92xXEB2IbUh+sIpQF8sGedTl42fhSArAxJriGWL7Z205jCjGUY5nTcjGwTPleJPLA8zekwo7FtloNQ+fVeVgQSpesqBOk0OcjrK8YB4POOuedKh4XbQzq4fnWAz3IHZPUX99vnMGAIy7/fwUh5ygc1s5AOPqPkQiG8NR3K+/OQsA4NzHv+LQPofQwGwTIn37zVkA424/PwmBwJpiGWL7K3AuhD2IdRSzdzC/6qOcxWwNzEQ/xtnGGGP8vEWYbdp/YpATd64R5u8p5tMHA3OrXsaWRTaS5+E1XwZnlDNG+OmAXz1FIC/jwQATmyiEvIYifgC++RJjFHVsKwSuo5hfELjVkwTL6yL1rB6uYyiBYEGsJ/4fCDHxR4RRxAYiuhDDszDwflqIeheBvJjRI8Q8xLiFiOaHAJhYUxwktn8BmhKwIHfk/QGx/+CRF7CBqDZE6FkNsX8gRL6NMAoZPcR1FPEWouIPAR2LbBTPCvAyjsvnQa4n9h8Q/wdvTLeHyD5C4GBgPRmIfsujSsQGIfIhwi1Exh/pLK+L0rN2M+Bm8TwIHlk/MQE+sahKFTAW7HlkGTWxK0jY8g4SGohtid9CdPNPMphYUwwkdjUHNgvnQbAjtoOUjtenaiC6iVAzRtYnSIk/WWTSNRB9y/sJCe/SNSyyETwrwGw8LZoHyTvWJ0j7hUWYJmA82PLW8yyxTRJwvCbZHuIHnksBfTLD6yL0rO08wHHBPIgOLJPI8HyaHSS0vGHelvUJEvesKdUF41XE7iGpSwZn1sRDYlsG2LBUwYLoirg9pP7K6tNUKWBiPc4LLJOqYpFJ5CH+jufSQJ+sZpFledYEbHteprMF2TvWbbKKRWkwyY5Fsyxx/4Lkv1h1mhESBtZPSHybzPA6Vs/qeICnJdojCJ9YmAyeWC7FBElXSVasu3Qtq09TJ7DEvksFT6ngzJo4SGwbAaBbnnuQboj7DdJ/Zq1SDGlckiPLpnOskMYkqHkm2edknkWW4VkjxL25LMvZgnjP+ijgltWrRGwQyCKT4hES9qy/IfltMuR1jJ5VRwLcL0mHIH/NqgRY1qSRZX2X8J1VpVinmFi/p8Nk0LOmeUhsEwvgZlyKs4UcB5YVACzSyLN+l/CZ1abwKYhdpYNfyTyL7KyKdYaE2IQlCPeQZ2CBxF8sq1DL+k3CR9YuhUvgeEbA12TI62btWHUKAGyCeh1CpsT+LvHCcgr1rL+/C/y/rCGFSVDxQODHZNCzplmBZdIAYBNU2xrI1fGyrBQaWFkmgYQt67uEKp1nkZ1REbcHgf6s1tZAvjq0Ck0aTIvh0kFgdTN2LC8BwG6DQlODkHOpkIp57FifJVgBO9Y0I7BQBgBUvTK9h8zrN4aB9VECCKhYZF+oiNuDYKx2QYtzbSD79i0MAqt7Ycfykp7b1TG/c21AQx3qMvk/JbFjTS8EToAMsWqP+Uw7j6CkDq5MjiXhWGSvVMTd5XDV1btHcY87b0BRHbBM6pKAidVd2bGqbK7aqu0HEWFY1w60rTTYQpmYPHrW7xKMiI41XQmcABqic6u2H4aJNw3Drq2dBZ2dAsGUSQN5tKzvEpwIyyILABVxtyowrbsKC6jAxYJGQ34dlAVMrA4Adiyrz4Ka3KYGoUR6B7l4Fkn4TUbHmgAgcCYoedbFyTbA1WPHunOygSvK8VDAZxmGRRYq4nZF98ghyFuPFWsFWYtCnhPwtww4szpYs2zRHVmmDBxrvRgQWL8JICE1a4KJM0LRt6yqDAxrWI4j61u6Soph0S1x67KrWOsygMCh5VixCJP9LgXOLL4pO2RNhdCzqsVwvNtkv8TUqc5Q+I8csmVQs3aLAbw+lSMxmKouvTVrWwaWRbgYPYtMos9yoE9kSq9ikZFStYd1pRdMrEaKqftdbbLyvE9pDAnyaQ5Q/IG1leFGej5atTpWMCJwTVebnJBHJsknSZjGl9+WRU5CRy8Gq5Vl0V6CG+nFTUbQ8/5M4UgS9Emw/CzvgsnwRDNHrWBk0X26hubeZFTx6DYe/pTlU/TwCjyz6ISJ3IVme61qHvlEuKfZ54xg5P1jo30hWRgS+NeA59EJkzTE7LXCwCOfxI3ENBl5Hj3ZSH+QMNjFC/gagJFHo43nzsQNWkETgZp42BG7yghGHj3ZKH+QuCreDl6FPgJRh3HcgSKqhSECnV0cbALx25x8BPrnjmd+kDwI0arXAYwxKDSGhf5AUdWCJgbRoeLZbaCYPicYIxD1bh5+oPhJdrECvBJdFCI6rxy+YKv2SJGPesEYhWjaefsCuno3UWSblYtC9PM3d83efqWUSapYu9cCbCNdnYbhkZJ6xVyk68MwUNIRsoIuztXv339R6iQwRXKvBhwTJB9BMehSJL/JDMd4EtN0cSZ4Pdp8nGpwymYDmYENStk43SsCfC4edDMhkxNmB14pmKLY1wR0eXhQDmzI4oSQHzRKdTEmeF1ucvCgHtiQwQOCBrDRycZoXhmwETdaSNYrADaI64CdC2xUgnME89oAL2yPkK5NY4SAPcsaHfBtLuBVqnlneH26UdDoIKZn1WmANcUC3EtqEGKyHsWAu0j4JM3w6lcI4FbKxUNcwzKJes42GsDNRcrWQNye08kB3KfzThryzGsEwB0kjB6iHxgHSOw4NgHgVsTWQGzPMYIAbsY0owXekMqzDvBa9YdUfQUJLcOmgv28DtKabaqpRkh4mteB8GZK0CCAl3Zg+VcLgN2GeMcaIa2f5SE5nuacMBEA1ud4U2chrbnMOaE0AH+IE7YGAKBl9YkMsfEVAwCuGyI8riuE9G58YXQgELuXOhBp6j7wQl9bSI8PL3WQpal71tEjXO1ZbaKO1cPr11bteri+a70DsdVuGIZ1BUJNfRyGvjYg17hV2w9X+3blDEi1q+Mw9LWBfK1vd8PV9crBzInlE00s/wp6E0ViuzQVcQP+O8DzIO2OtYN/B/asxzRI7OrfAUjsdRrPCvDvwIZXpTmzdu9aZtUPfW0kYGAFSGqJ7d6xsKPrB5euI/YuTcea4B37RDP3JpEjfpUmsLp3rIZmhyaJDbwRklbEtu9XGOYRjS6efSR+naZnTfB+7Yn/YCK5QPyASZDYzTtWG4Fo5yLglmI2kLTmmXesYxSisbbz7DZQzBHTjKwzvGP3kYgoHNraOed82weKfANJLbHr96xVPIF7SNvxzHuWzWfERIF1hnfth2wspHXE9u9bJmTiIXHHw/ctsCELD6kfWT28d9uQgYfkxPbvXmDP0oKH5MjD9y+A/5E1WkhvWTt4F7cHQXsEiazqfQzAHYSMDmSeGSO8n9utgNGDVM+4eUcDQN+nOXsQvJm1gfd29LsQ6bEzIHszYwPv8tavhzArHNcVgvyb85Wzg/d8665byNc45wwIBQ==";

const OK="ok", IND="ind";
/* Capturas reais (opcional). Coloquem os ficheiros num servidor Goldenergy e indiquem a pasta em base.
   Nome do ficheiro: {guia}-{n}.webp (ex.: bmw-1.webp) ou, para uma marca específica, {marca}-{guia}-{n}.webp (ex.: opel-stellantis-2.webp).
   Só são usados os ficheiros listados em files. Se um ficheiro falhar, aparece a ilustração. */
const SHOTS={base:"",files:[]};
/* Temas visuais inspirados nas apps (cores aproximadas, sem logótipos oficiais dentro das ilustrações).
   hd/hdfg = cor da barra superior nas apps com cabeçalho colorido */
const THEMES={
  tesla:{dark:1,bg:"#171717",card:"#232323",fg:"#FFFFFF",mut:"#8E8E93",line:"#2C2C2E",acc:"#3E6AE1",on:"#FFFFFF",name:"Tesla"},
  bmw:{bg:"#FFFFFF",card:"#F2F3F5",fg:"#1A1A1A",mut:"#6F737A",line:"#E5E7EA",acc:"#1C69D4",on:"#FFFFFF",name:"My BMW"},
  mini:{bg:"#FFFFFF",card:"#F3F3F3",fg:"#1A1A1A",mut:"#6E6E6E",line:"#E6E6E6",acc:"#C4561F",on:"#FFFFFF",hd:"#C4561F",hdfg:"#FFFFFF",name:"MINI"},
  peugeot:{bg:"#FFFFFF",card:"#F2F4F7",fg:"#0F2B4A",mut:"#6B7A8C",line:"#E1E5EA",acc:"#1E88E5",on:"#FFFFFF",name:"MyPeugeot"},
  lancia:{bg:"#F2F3F5",card:"#FFFFFF",fg:"#0B1220",mut:"#6B7280",line:"#E3E5E9",acc:"#0B1220",on:"#FFFFFF",hd:"#0B1220",hdfg:"#FFFFFF"},
  citroen:{bg:"#FFFFFF",card:"#F4F5F7",fg:"#1D1D1B",mut:"#6F6F6E",line:"#E3E3E3",acc:"#DA291C",on:"#FFFFFF",name:"MyCitroën"},
  opel:{bg:"#FFFFFF",card:"#F3F3F3",fg:"#000000",mut:"#666666",line:"#E0E0E0",acc:"#F7E400",on:"#000000",name:"MyOpel"},
  ds:{dark:1,bg:"#181818",card:"#211F20",fg:"#F3EFE7",mut:"#A39E94",line:"#2F2627",acc:"#B5004A",on:"#FFFFFF",name:"MyDS"},
  fiat:{bg:"#F1F1F2",card:"#FFFFFF",fg:"#1F1F1F",mut:"#6E6E73",line:"#E2E2E5",acc:"#00BFD1",on:"#FFFFFF",hd:"#2A2A2C",hdfg:"#FFFFFF",name:"FIAT"},
  jeep:{bg:"#F2F2F2",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B6B",line:"#E0E0E0",acc:"#F2C200",on:"#1A1A1A",hd:"#2B2B2B",hdfg:"#FFFFFF",name:"Jeep"},
  alfa:{dark:1,bg:"#0E0E0E",card:"#1A1A1A",fg:"#FFFFFF",mut:"#A3A3A3",line:"#2A2A2A",acc:"#B5132F",on:"#FFFFFF"},
  renault:{swc:"#74C367",dark:1,bg:"#161616",card:"#292929",fg:"#FFFFFF",mut:"#9E9E9E",line:"#333333",acc:"#EFDF00",on:"#000000",name:"My Renault"},
  dacia:{swc:"#74C367",dark:1,bg:"#181818",card:"#292929",fg:"#FFFFFF",mut:"#A2A69B",line:"#333333",acc:"#7C8564",on:"#FFFFFF",name:"My Dacia"},
  alpine:{swc:"#74C367",dark:1,bg:"#0D1015",card:"#1A1E26",fg:"#FFFFFF",mut:"#9AA3AF",line:"#272C35",acc:"#2D7BFF",on:"#FFFFFF",name:"My Alpine"},
  bentley:{bg:"#FFFFFF",card:"#F4F4F1",fg:"#1A1A1A",mut:"#76766F",line:"#E6E6E0",acc:"#2F5D4B",on:"#FFFFFF",name:"My Bentley"},
  gwm:{bg:"#EEF6F4",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6F7A78",line:"#E1EAE7",acc:"#16B08F",on:"#FFFFFF",name:"My GWM"},
  vw:{bg:"#EEF2F7",card:"#FFFFFF",fg:"#001E50",mut:"#5B6B85",line:"#DCE3EE",acc:"#001E50",on:"#FFFFFF"},
  volkswagen:{bg:"#F4F2EE",card:"#FFFFFF",fg:"#0F1B33",mut:"#6A7385",line:"#E4E1DB",acc:"#0F1B33",on:"#FFFFFF",name:"Volkswagen"},
  zeekr:{bg:"#F4F1EC",card:"#FFFFFF",fg:"#222326",mut:"#797B7E",line:"#E6E1DA",acc:"#63B96B",on:"#FFFFFF",name:"ZEEKR"},
  audi:{dark:1,bg:"#171D24",card:"#242D36",fg:"#FFFFFF",mut:"#A4AFB8",line:"#35414C",acc:"#36A9D6",on:"#101820",name:"myAudi"},
  seat:{bg:"#F5F5F5",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B6B",line:"#E6E6E6",acc:"#138C82",on:"#FFFFFF",name:"My SEAT"},
  skoda:{dark:1,bg:"#17191B",card:"#24272A",fg:"#FFFFFF",mut:"#A7ABAE",line:"#2E3236",acc:"#78FAAE",on:"#0E1A14",name:"MyŠkoda"},
  cupra:{dark:1,bg:"#1E1F24",card:"#2A2C33",fg:"#FFFFFF",mut:"#A4A7AE",line:"#3A3D45",acc:"#00C1C1",on:"#0F1013"},
  hyundai:{bg:"#F0F4F8",card:"#FFFFFF",fg:"#112B49",mut:"#718096",line:"#DFE6EE",acc:"#003B70",on:"#FFFFFF",name:"myHyundai"},
  kia:{dark:1,bg:"#05141F",card:"#132633",fg:"#FFFFFF",mut:"#9FB0BC",line:"#203645",acc:"#FFFFFF",on:"#05141F",name:"Kia"},
  genesis:{dark:1,bg:"#0B0B0B",card:"#191919",fg:"#FFFFFF",mut:"#A3A3A3",line:"#2A2A2A",acc:"#C59E77",on:"#0B0B0B"},
  mercedes:{bg:"#F3F4F6",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B6B",line:"#E2E4E8",acc:"#0078D6",on:"#FFFFFF",hd:"#000000",hdfg:"#FFFFFF",name:"Mercedes-Benz"},
  volvo:{bg:"#EDEEEB",card:"#FFFFFF",fg:"#222722",mut:"#717873",line:"#D9DDD8",acc:"#176B4B",on:"#FFFFFF",name:"Volvo Cars"},
  polestar:{dark:1,bg:"#101010",card:"#1E1E1E",fg:"#FFFFFF",mut:"#9C9C9C",line:"#2A2A2A",acc:"#FF7500",on:"#101010",name:"Polestar"},
  mg:{bg:"#EEF4FA",card:"#FFFFFF",fg:"#171B20",mut:"#6B7280",line:"#DFE7EF",acc:"#1F6FE5",on:"#FFFFFF",name:"MG iSMART"},
  ford:{dark:1,bg:"#1C1C1E",card:"#2C2C2E",fg:"#FFFFFF",mut:"#A1A1A6",line:"#3A3A3C",acc:"#2E7BF6",on:"#FFFFFF",name:"Ford"},
  toyota:{bg:"#FFFFFF",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B6B6B",line:"#E6E6E6",acc:"#EB0A1E",on:"#FFFFFF",name:"MyToyota"},
  lexus:{bg:"#FFFFFF",card:"#FFFFFF",fg:"#1A1A1A",mut:"#767676",line:"#E6E6E6",acc:"#1A1A1A",on:"#FFFFFF",name:"Lexus Link+"},
  nissan:{bg:"#F4F5F7",card:"#FFFFFF",fg:"#1A1A1A",mut:"#6B7280",line:"#E5E7EB",acc:"#1F6FC5",on:"#FFFFFF",name:"MyNISSAN"},
  porsche:{dark:1,bg:"#0E0F11",card:"#1C1D20",fg:"#FBFCFF",mut:"#8F9196",line:"#2C2D31",acc:"#FBFCFF",on:"#0E0F11",name:"My Porsche"},
  honda:{dark:1,bg:"#0E0B0C",card:"#1E1819",fg:"#FFFFFF",mut:"#A79FA0",line:"#2E2627",acc:"#E4002B",on:"#FFFFFF",name:"My Honda+"},
  mazda:{dark:1,bg:"#000000",card:"#141414",fg:"#FFFFFF",mut:"#9A9A9A",line:"#262626",acc:"#FFFFFF",on:"#000000",name:"MyMazda"},
  jlr:{dark:1,bg:"#121417",card:"#1D2125",fg:"#FFFFFF",mut:"#9BA3AB",line:"#2B3036",acc:"#C9A27A",on:"#121417"},
  landrover:{bg:"#FFFFFF",card:"#F2F3F5",fg:"#1A1A1A",mut:"#6B6F75",line:"#E4E6E9",acc:"#C8743A",on:"#FFFFFF",name:"Land Rover Remote"},
  smart:{dark:1,bg:"#1A1A1A",card:"#2A2A2A",fg:"#FFFFFF",mut:"#A3A3A3",line:"#3A3A3A",acc:"#D7E600",on:"#000000",name:"smart"},
  xpeng:{bg:"#F1F4FB",card:"#FFFFFF",fg:"#111318",mut:"#7A8090",line:"#E3E7F0",acc:"#26B36B",on:"#FFFFFF",name:"XPENG"},
  byd:{bg:"#EEF2F7",card:"#FFFFFF",fg:"#1B1F2A",mut:"#7A8394",line:"#E3E7EE",acc:"#2F6BDE",on:"#FFFFFF",name:"BYD"},
  denza:{dark:1,bg:"#151C30",card:"#222B44",fg:"#FFFFFF",mut:"#A3ADC4",line:"#2E3854",acc:"#4C8DFF",on:"#FFFFFF",name:"DENZA"},
  maserati:{bg:"#EDEDED",card:"#FFFFFF",fg:"#1A1A1A",mut:"#707070",line:"#DEDEDE",acc:"#0C2340",on:"#FFFFFF",hd:"#3A3A3A",hdfg:"#FFFFFF",name:"Maserati Connect"},
  leap:{bg:"#F4F7F6",card:"#FFFFFF",fg:"#1A1A1A",mut:"#7B8582",line:"#E6ECEA",acc:"#17A673",on:"#FFFFFF",name:"Leapmotor"},
  lotus:{dark:1,bg:"#1A1B1E",card:"#2A2B2F",fg:"#FFFFFF",mut:"#A0A3A8",line:"#36383D",acc:"#FFF200",on:"#111111",name:"Lotus Cars"},
  lucid:{dark:1,bg:"#121212",card:"#1F1F1F",fg:"#FFFFFF",mut:"#9A9A9A",line:"#2E2E2E",acc:"#C2A26B",on:"#121212",name:"Lucid"},
  lynk:{dark:1,bg:"#161616",card:"#232323",fg:"#FFFFFF",mut:"#9A9A9A",line:"#2F2F2F",acc:"#2EF0C8",on:"#0B0B0B",name:"Lynk & Co"},
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
const APP_FONT="'Roboto',system-ui,-apple-system,'Segoe UI',Arial,sans-serif";
const FONT={inter:APP_FONT,mont:APP_FONT,dm:APP_FONT,pop:APP_FONT,rob:APP_FONT,src:APP_FONT,serif:APP_FONT};
const SKIN={
  tesla:{short:1,home:"x-tesla",list:"flat",hd:"c",sw:"ios",time:"pair",day:"text",btn:"fill",batt:"cell",seg:"line",r:"10px",br:"6px",tabs:0,ind:"plain",ff:FONT.inter,tw:600,licon:1},
  bmw:{short:1,home:"x-bmw",list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"sq",batt:"bmw",seg:"pill",r:"6px",br:"2px",tabs:5,tabsL:["Veículo","Mapa","Ideias","Compras","Perfil"],tabsNoL:1,ind:"bar",ff:FONT.inter,tw:600,licon:1},
  mini:{short:1,home:"x-mini",band:1,list:"sep",hd:"L",sw:"md",time:"chip",day:"circle",btn:"sq",batt:"bar",seg:"line",r:"4px",br:"2px",tabs:5,tabsL:["Veículo","Mapa","Explorar","Compras","Perfil"],tabsNoL:1,ind:"bar",ff:FONT.inter,tw:500,up:1,licon:1},
  peugeot:{short:1,home:"x-peugeot",list:"sep",hd:"L",sw:"md",time:"chip",day:"square",btn:"sq",batt:"stl",seg:"line",r:"2px",br:"2px",tabs:0,ind:"plain",ff:FONT.rob,tw:500,licon:1},
  lancia:{home:"band",band:1,list:"sep",hd:"c",sw:"md",time:"field",day:"square",btn:"sq",batt:"bar",seg:"line",r:"6px",br:"4px",tabs:4,tabsL:["Início\u2060","Mapa","Serviços","Perfil"],ind:"bar",homeLinks:"tiles",ff:FONT.pop,tw:600,up:1},
  citroen:{short:1,home:"x-citroen",list:"sep",hd:"L",sw:"md",time:"chip",day:"circle",btn:"fill",batt:"stl",seg:"line",r:"8px",br:"999px",tabs:0,ind:"plain",ff:FONT.rob,tw:700,licon:1},
  opel:{short:1,home:"x-opel",list:"sep",hd:"L",sw:"md",time:"chip",day:"square",btn:"sq",batt:"stl",seg:"pill",r:"2px",br:"2px",tabs:0,ind:"plain",ff:FONT.rob,tw:700,licon:1},
  ds:{short:1,home:"x-ds",list:"sep",hd:"L",sw:"md",time:"chip",day:"text",btn:"fill",batt:"stl",seg:"line",r:"2px",br:"2px",tabs:0,ind:"bar",ff:FONT.src,hf:FONT.src,tw:400,licon:1},
  fiat:{home:"x-fiat",band:1,list:"sep",hd:"l",sw:"md",time:"field",day:"circle",btn:"fill",batt:"bar",seg:"line",r:"8px",br:"6px",tabs:0,ind:"plain",ff:FONT.mont,tw:600,licon:1},
  jeep:{home:"x-jeep",band:1,list:"sep",hd:"l",sw:"md",time:"field",day:"square",btn:"sq",batt:"bar",seg:"line",r:"4px",br:"3px",tabs:0,ind:"bar",ff:FONT.rob,tw:500,licon:1},
  alfa:{home:"min",list:"flat",hd:"c",sw:"sq",time:"plain",day:"square",btn:"sq",batt:"cell",seg:"line",r:"4px",br:"2px",tabs:4,ind:"bar",ff:FONT.inter,tw:500,up:1,licon:1},
  renault:{hf:FONT.mont,full:1,home:"x-alp",list:"card",hd:"L",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"bar",seg:"line",r:"6px",br:"4px",tabs:5,tabsL:["Veículo","Mapas","Ajuda","Loja","Conta"],ind:"plain",ff:FONT.inter,tw:700,up:1,licon:1},
  dacia:{hf:FONT.mont,home:"x-alp",list:"card",hd:"L",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"bar",seg:"line",r:"8px",br:"6px",tabs:5,tabsL:["Veículo","Mapas","Ajuda","Loja","Conta"],ind:"plain",ff:FONT.inter,tw:700,licon:1},
  alpine:{home:"x-alp",list:"card",hd:"L",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"bar",seg:"line",r:"8px",br:"6px",tabs:5,tabsL:["Veículo","Mapas","Ajuda","Loja","Conta"],ind:"plain",ff:FONT.inter,tw:600,licon:1},
  bentley:{hf:FONT.mont,home:"x-bent",list:"sep",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"sq",batt:"ring",ringc:"#2F5D4B",seg:"line",r:"2px",br:"2px",tabs:5,tabsL:["Início\u2060","Funcionalidades","Navegar","Notificações","Perfil"],tabsNoL:1,ind:"plain",ff:FONT.mont,tw:300,up:1,licon:1},
  gwm:{home:"x-gwm",list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"gwm",ringc:"#16B08F",seg:"pill",r:"14px",br:"999px",tabs:2,tabsL:["Veículo","Eu"],tabsNoL:1,ind:"plain",ff:FONT.inter,tw:600,licon:1},
  vw:{short:1,ringc:"#2F7DE1",home:"ring",list:"card",hd:"c",sw:"ios",time:"plain",day:"pill",btn:"fill",batt:"ring",seg:"pill",r:"14px",br:"999px",tabs:4,tabsL:["Carro","Mapa","Carregar","Perfil"],ind:"plain",ff:FONT.dm,tw:700,licon:1},
  volkswagen:{short:1,home:"x-vw",list:"card",hd:"c",sw:"ios",time:"plain",day:"pill",btn:"fill",batt:"vwarc",seg:"line",r:"6px",br:"999px",tabs:0,ind:"plain",ff:FONT.inter,tw:600,licon:1},
  zeekr:{short:1,home:"x-zeekr",list:"card",hd:"c",sw:"ios",time:"pair",day:"circle",btn:"fill",batt:"zeekr",seg:"pill",r:"10px",br:"6px",tabs:0,ind:"plain",ff:FONT.inter,tw:600,licon:1},
  audi:{home:"x-audi",list:"card",hd:"L",sw:"ios",time:"chip",day:"square",btn:"fill",batt:"audi",seg:"line",r:"6px",br:"6px",tabs:5,tabsL:["Veículo","Navegar","Áudio","Internet","Loja"],tabsNoL:1,ind:"pill",ff:FONT.inter,tw:400,licon:1},
  seat:{short:1,home:"x-seat",list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"seat",seg:"line",r:"12px",br:"999px",tabs:4,tabsL:["Veículo","Mapas","Serviços","Perfil"],ind:"pill",ff:FONT.inter,tw:700,licon:1},
  skoda:{short:1,home:"x-skoda",list:"card",hd:"L",sw:"md",time:"chip",day:"circle",btn:"fill",batt:"skoda",seg:"pill",r:"14px",br:"999px",tabs:5,tabsL:["Carro","Mapas","Inspecionar","Descobrir","Perfil"],ind:"plain",ff:FONT.mont,tw:800,licon:1},
  cupra:{home:"x-cupra",list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"cupra",seg:"line",r:"12px",br:"999px",tabs:5,tabsL:["Veículo","Mapas","Tribe","Serviços","Perfil"],ind:"plain",ff:FONT.dm,tw:400,up:1},
  hyundai:{home:"x-hyundai",list:"card",hd:"c",sw:"ios",time:"pair",day:"circle",btn:"fill",batt:"ring",ringc:"#003B70",seg:"pill",r:"14px",br:"999px",tabs:5,tabsL:["Início\u2060","Controlo","Mapa","Descobrir","Veículo"],ind:"plain",ff:FONT.rob,tw:500,licon:1},
  kia:{home:"x-kia",list:"sep",hd:"l",sw:"md",time:"field",day:"pill",btn:"fill",batt:"bar",seg:"pill",r:"12px",br:"999px",tabs:0,ind:"pill",ff:FONT.inter,tw:600,licon:1},
  genesis:{home:"min",list:"flat",hd:"c",sw:"sq",time:"plain",day:"square",btn:"outline",batt:"cell",seg:"line",r:"2px",br:"2px",tabs:0,ff:FONT.src,hf:FONT.src,tw:400,up:1,licon:1},
  mercedes:{hf:FONT.serif,home:"x-merc",band:1,list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"merc",seg:"pill",r:"10px",br:"10px",tabs:4,tabsL:["Início\u2060","Funcionalidades","Navegar","Compras"],tabsNoL:1,ind:"plain",ff:FONT.rob,tw:400,licon:1},
  volvo:{short:1,home:"x-volvo",list:"flat",hd:"L",sw:"ios",time:"plain",day:"text",btn:"fill",batt:"volvo",seg:"line",r:"8px",br:"999px",tabs:5,tabsL:["Início\u2060","Mapa","Carro","Mensagens","Perfil"],tabsNoL:1,ind:"plain",ff:FONT.src,tw:400,licon:1},
  polestar:{short:1,home:"x-polestar",list:"flat",hd:"L",sw:"sq",time:"pair",day:"square",btn:"full",batt:"polestar",seg:"line",r:"0",br:"0",tabs:5,tabsL:["Início\u2060","Carro","Funcionalidades","Ajuda","Conta"],tabsNoL:1,ind:"bar",ff:FONT.inter,tw:300,licon:1},
  mg:{home:"x-mg",list:"card",hd:"c",sw:"ios",time:"field",day:"circle",btn:"fill",batt:"ring",ringc:"#2BB673",seg:"pill",r:"12px",br:"999px",tabs:5,tabsL:["Carro","Segurança","Mapa","Mensagens","Perfil"],tabsNoL:1,ind:"plain",ff:FONT.rob,tw:600,licon:1},
  ford:{home:"x-ford",list:"sep",hd:"L",sw:"md",time:"field",day:"square",btn:"fill",batt:"ford",seg:"line",r:"4px",br:"4px",tabs:3,tabsL:["Veículo","Carregar","Serviços"],tabsNoL:1,ind:"plain",ff:FONT.rob,tw:500},
  toyota:{short:1,home:"x-toyota",list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"toyota",seg:"pill",r:"10px",br:"999px",tabs:4,tabsL:["Carro","Notificações","Conta","Ajuda"],tabsNoL:1,ind:"plain",ff:FONT.inter,tw:600,licon:1},
  lexus:{home:"x-lexus",list:"flat",hd:"c",sw:"sq",time:"plain",day:"text",btn:"sq",batt:"cell",seg:"line",r:"0",br:"0",tabs:5,tabsL:["Veículo","Mapa","Notificações","Perfil","Ajuda"],tabsNoL:1,ind:"plain",ff:FONT.src,tw:400,licon:1},
  nissan:{short:1,home:"x-nissan",list:"card",hd:"L",sw:"md",time:"chip",day:"circle",btn:"fill",batt:"nissan",seg:"line",r:"6px",br:"999px",tabs:0,ind:"plain",ff:FONT.dm,tw:500,licon:1},
  porsche:{short:1,home:"x-porsche",list:"card",hd:"c",sw:"ios",time:"chip",day:"square",btn:"fill",batt:"porsche",seg:"line",r:"6px",br:"6px",tabs:4,tabsL:["Veículo","Mapa","Descobrir","Conta"],ind:"plain",ff:FONT.inter,tw:600,licon:1},
  honda:{home:"x-honda",list:"flat",hd:"c",sw:"md",time:"field",day:"square",btn:"sq",batt:"ring",ringc:"#7ED957",seg:"line",r:"2px",br:"2px",tabs:4,tabsL:["Descobrir","Viagens","Segurança","Painel"],ind:"plain",ff:FONT.rob,tw:500,licon:1},
  mazda:{short:1,home:"x-mazda",list:"sep",hd:"c",sw:"md",time:"chip",day:"square",btn:"fill",batt:"bar",seg:"line",r:"0",br:"0",tabs:5,tabsL:["Início\u2060","Veículo","Serviços","Ajuda","Menu"],ind:"bar",ff:FONT.inter,tw:300,licon:1},
  jlr:{home:"x-jag",list:"sep",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"bar",seg:"line",r:"10px",br:"10px",tabs:0,ind:"plain",ff:FONT.src,tw:600,licon:1},
  landrover:{short:1,home:"x-jag",list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"bar",seg:"line",r:"12px",br:"10px",tabs:0,ind:"plain",ff:FONT.src,tw:600,licon:1},
  smart:{short:1,home:"x-smart",list:"card",hd:"L",sw:"ios",time:"pair",day:"circle",btn:"fill",batt:"smart",seg:"pill",r:"14px",br:"999px",tabs:0,ind:"plain",ff:FONT.pop,tw:600,licon:1},
  xpeng:{short:1,home:"x-xpeng",list:"card",hd:"c",sw:"ios",time:"pair",day:"circle",btn:"fill",batt:"xpeng",seg:"pill",r:"12px",br:"999px",tabs:0,ind:"plain",ff:FONT.dm,tw:600,licon:1},
  byd:{ringc:"#34C759",home:"x-byd",list:"sep",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"18px",br:"14px",tabs:2,tabsL:["O meu veículo","A minha conta"],ind:"plain",ff:FONT.inter,tw:600,licon:1},
  denza:{ringc:"#3DDC6A",home:"x-denza",list:"sep",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"16px",br:"14px",tabs:0,ind:"plain",ff:FONT.inter,tw:600,licon:1},
  maserati:{home:"x-mas",band:1,list:"sep",hd:"l",sw:"md",time:"field",day:"square",btn:"sq",batt:"bar",seg:"line",r:"2px",br:"2px",tabs:0,ind:"bar",ff:FONT.src,tw:400,licon:1},
  leap:{home:"x-leap",list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"leap",seg:"pill",r:"12px",br:"8px",tabs:2,tabsL:["O meu veículo","Centro pessoal"],ind:"plain",ff:FONT.inter,tw:600,licon:1},
  lotus:{home:"x-lotus",list:"card",hd:"l",sw:"md",time:"field",day:"square",btn:"fill",batt:"bar",seg:"line",r:"4px",br:"4px",tabs:0,ind:"bar",ff:FONT.inter,tw:500,licon:1},
  lucid:{hf:FONT.serif,home:"x-lucid",list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"outline",batt:"bar",seg:"line",r:"12px",br:"999px",tabs:0,ind:"plain",ff:FONT.src,tw:400,up:1,licon:1},
  lynk:{home:"x-lynk",list:"card",hd:"c",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"lynk",seg:"pill",r:"10px",br:"999px",tabs:4,tabsL:["Início\u2060","Partilhar","Emprestar","Perfil"],ind:"plain",ff:FONT.inter,tw:400,licon:1},
  cn:{home:"dash",list:"sep",hd:"c",sw:"md",time:"field",day:"circle",btn:"fill",batt:"ring",seg:"pill",r:"14px",br:"999px",tabs:4,tabsL:["Carro","Serviços","Loja","Eu"],ind:"pill",quick:"lab",ff:FONT.rob,tw:700},
  wb:{list:"card",hd:"l",sw:"ios",time:"pair",day:"circle",btn:"fill",batt:"bar",seg:"pill",r:"14px",br:"999px",tabs:0,ff:FONT.inter,tw:700},
  generic:{home:"dash",list:"card",hd:"l",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"bar",seg:"pill",r:"14px",br:"999px",tabs:4,ind:"plain",quick:"round",ff:FONT.inter,tw:700,licon:1}
};
/* Tema por marca (sobrepõe o tema do guia nas apps de telemóvel) */
const BRAND_THEME={"Peugeot":"peugeot","Citroën":"citroen","Opel":"opel","DS Automobiles":"ds","Fiat":"fiat","Abarth":"alfa","Alfa Romeo":"alfa","Lancia":"lancia","Jeep":"jeep",
  "Audi":"audi","Škoda":"skoda","CUPRA":"cupra","SEAT":"seat","Volkswagen":"volkswagen","Hyundai":"hyundai","Kia":"kia","Genesis":"genesis","Mini":"mini","Lexus":"lexus",
  "Jaguar":"jlr","Land Rover":"landrover","Renault":"renault","Alpine":"alpine","Mazda":"mazda","Denza":"denza"};

/* Linhas: hero | link(label,sub) | sect | radio(label,on) | tog(label,on) | time(label,S/E) | days | seg(opts,idx) | val(label,v) | slider(label,%) | note | warn | tiles([..],idx)
   Ecrã: {t:título, k:"app"|"car"|"wb", th:tema, rows, btn, hl:[índices destacados], cap:legenda}
   map: ecrã mostrado por cada passo */
const GUIDES={
tesla:{level:OK, th:"tesla",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Controlos"],["link","Climatização","Desligada · Interior 18 °C"],["link","Carregamento","Ligado · 62 %"],["link","Localização","Casa"]],hl:[3]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["slider","Limite de carga",80],["link","Agendar","Sem agendamentos"]],hl:[2]},
    {t:"Agendar",cap:"Agendar carregamento",rows:[["seg",["Carregamento","Partida"],0],["time","Começar às","S"],["time","Terminar às","E"],["days"],["val","Localização","Casa"]],btn:"Guardar",hl:[1,2]}
  ],
  map:[0,1,2,1],
  steps:[
    "Na app {app}, toque em <b>Carregamento</b> (ou no ícone do raio, por baixo do carro).",
    "Toque em <b>Agendar</b> e escolha o separador <b>Carregamento</b> (não «Partida»).",
    "Defina <b>Começar às</b> {inicio} e <b>Terminar às</b> {fim}, escolha os dias e guarde. O horário fica associado à localização «Casa».",
    "Ligue o cabo. A app deve mostrar que o carregamento está agendado."
  ],
  power:"Com o cabo ligado, ajuste a corrente com os botões <b>−</b> e <b>+</b> no ecrã de carregamento (app ou carro). O valor fica guardado para casa.",
  tip:"Defina sempre a hora de fim. Se usar apenas a <b>Partida</b> e o vazio não chegar para completar a carga, o carro continua a carregar depois de o vazio acabar."
},
bmw:{level:IND, th:"bmw",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Estado de carga","62 % · 280 km"]],hl:[1]},
    {t:"Estado de carga",cap:"Estado de carga",rows:[["batt",62],["sect","Definições"],["slider","Carregar até",80],["link","Temporizador de carga e climatização","Modo de carregamento · Partidas"]],hl:[2,3]},
    {t:"Modo de carregamento",cap:"Modo de carregamento",rows:[["radio","Carregar imediatamente",0],["radio","Carregar no intervalo de tempo",1],["time","Início","S"],["time","Fim","E"]],btn:"Guardar",hl:[1,2,3]},
    {t:"Hora de partida",cap:"Hora de partida (obrigatória)",rows:[["tog","Partida 1",1],["time","Hora de partida","E"],["days"],["tog","Climatização",0],["warn","Sem uma partida ativa, o intervalo de tempo não é aplicado."]],btn:"Guardar",hl:[0,1]}
  ],
  map:[0,1,2,3,1],
  steps:[
    "Na app {app}, no ecrã do carro, toque no cartão <b>Estado de carga</b>.",
    "Em <b>Definições</b>, ajuste <b>Carregar até</b> (por exemplo, 80%) e abra o <b>temporizador de carga e climatização</b>. Se não o vir, toque em <b>Ver tudo</b>. Em algumas versões da app, chama-se <b>Definições de carregamento</b>.",
    "Em <b>Modo de carregamento</b>, escolha <b>Carregar no intervalo de tempo</b> e defina o início às {inicio} e o fim às {fim}.",
    "Ative uma <b>hora de partida</b> às {fim} para os dias em que quer carregar. Sem uma partida ativa, o intervalo não é aplicado. Desligue a climatização, se não precisar dela.",
    "Guarde e ligue o cabo. O carro pode carregar alguns minutos e depois parar até à hora de início. É normal."
  ],
  power:"No ecrã do carro (iDrive), no menu de <b>carregamento</b>, procure o limite de <b>corrente de carga AC</b>. Em alguns modelos, a mesma opção também aparece na app.",
  tip:"<b>Atenção:</b> o BMW dá prioridade a atingir o objetivo de carga até à hora de partida. Se a bateria estiver muito descarregada, pode começar antes das {inicio} ou continuar depois das {fim}. Para garantir que só carrega no vazio, escolha <b>Carregar imediatamente</b> e programe o horário na wallbox. Alguns textos da app podem aparecer em português do Brasil."
},
volkswagen:{level:OK, th:"volkswagen",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"]],hl:[1]},
    {t:"Carregamento",cap:"Painel de carregamento",rows:[["batt",62],["link","Locais de carregamento","Casa"]],hl:[1]},
    {t:"Casa",cap:"Local de carregamento «Casa»",rows:[["tog","Horas de carregamento preferenciais",1],["time","Início","S"],["time","Fim","E"],["val","Nível mínimo de carga","0 %"],["tog","Reduzir corrente de carga AC",0]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, toque no cartão escuro da bateria (autonomia e %) para abrir o painel de carregamento.",
    "Abra <b>Locais de carregamento</b> e escolha «Casa». Se ainda não existir, crie-o no ecrã do carro, com o carro estacionado em casa.",
    "Ative <b>Horas de carregamento preferenciais</b>, defina {inicio}–{fim} e ponha o <b>Nível mínimo de carga</b> a 0%.",
    "Guarde. O horário fica associado a esse local e é aplicado sempre que carregar em casa."
  ],
  power:"No local «Casa», ative <b>Reduzir corrente de carga AC</b>. Normalmente, as opções são apenas «máxima» e «reduzida».",
  tip:"Até atingir o nível mínimo, o carro carrega logo que é ligado, mesmo fora do vazio. Por isso convém pô-lo a 0%. Na versão antiga da app (We Connect ID.), o caminho é <b>Carregamento › Locais de carregamento</b>."
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
opel:{level:OK, th:"opel",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","Imediato"],["link","Climatização","Desligada"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento diferido",rows:[["batt",62],["seg",["Imediato","Diferido"],1],["time","Programação do carregamento diferido","S"]],hl:[1,2]}
  ],
  map:[0,1,1,1],
  steps:[
    "Na app {app}, no separador inicial, toque em <b>Carregamento</b>.",
    "Mude de <b>Imediato</b> para <b>Diferido</b>.",
    "Em <b>Programação do carregamento diferido</b>, toque no lápis (✎) e defina a hora de início: {inicio}.",
    "Ligue o cabo. O carro espera até às {inicio} e depois carrega até ficar cheio."
  ],
  power:"A maioria dos modelos não permite limitar a corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:"A app só deixa escolher a hora de início. Uma carga normal costuma caber no vazio, que termina às {fim}. Nos modelos mais recentes, a app pode ter outro aspeto, mas o menu continua a chamar-se <b>Carregamento</b>. Se precisar de garantir que o carregamento para às {fim}, use o horário da wallbox."
},
peugeot:{level:OK, th:"peugeot",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","Imediato"],["link","Climatização","Desligada"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento diferido",rows:[["batt",62],["seg",["Imediato","Diferido"],1],["time","Programação do carregamento diferido","S"]],hl:[1,2]}
  ],
  map:[0,1,1,1],
  steps:[
    "Na app {app}, no separador inicial, toque em <b>Carregamento</b>.",
    "Mude de <b>Imediato</b> para <b>Diferido</b>.",
    "Em <b>Programação do carregamento diferido</b>, toque no lápis (✎) e defina a hora de início: {inicio}.",
    "Ligue o cabo. O carro espera até às {inicio} e depois carrega até ficar cheio."
  ],
  power:"A maioria dos modelos não permite limitar a corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:"A app só deixa escolher a hora de início. Uma carga normal costuma caber no vazio, que termina às {fim}. Nos modelos mais recentes, a app pode ter outro aspeto, mas o menu continua a chamar-se <b>Carregamento</b>. Se precisar de garantir que o carregamento para às {fim}, use o horário da wallbox."
},
skoda:{level:IND, th:"skoda",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Bateria","62 % · 280 km"]],hl:[1]},
    {t:"Bateria",cap:"Bateria",act:"gear",rows:[["batt",62],["link","Planos de partida","Plano 1 · 08:00"]],hl:[1]},
    {t:"Plano 1",cap:"Plano de partida",rows:[["tog","Plano 1",1],["val","Hora de partida","08:00"],["days"],["tog","Horário de carregamento preferencial",1],["time","Início","S"],["time","Fim","E"]],btn:"Guardar",hl:[3,4,5]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no separador <b>Carro</b>, toque no cartão <b>Bateria</b>.",
    "Escolha o limite de carga (por exemplo, 80%) e abra os <b>planos de partida</b>.",
    "Ative um plano e escolha a <b>hora de partida</b> (depois das {fim}) e os dias.",
    "Ative o <b>horário de carregamento preferencial</b> de {inicio} a {fim} e guarde."
  ],
  power:"No ecrã do carro, em <b>Carregamento › Locais de carregamento › Casa</b>, procure <b>Corrente de carga AC</b> e escolha «reduzida», se precisar.",
  tip:"Se a app não mostrar os planos de partida, defina o horário no ecrã do carro: <b>Carregamento › Locais de carregamento › Casa › Horário de carregamento preferencial</b>. O horário só funciona no local onde foi criado."
},
zeekr:{level:IND, th:"zeekr",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Controlo de energia"]],hl:[1]},
    {t:"Controlo de energia",cap:"Controlo de energia",rows:[["batt",62],["tog","Carregamento agendado",0],["tog","Reservar viagem",0]],hl:[1]},
    {t:"Carregamento agendado",cap:"Carregamento agendado",rows:[["tog","Carregamento agendado",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no ecrã inicial, toque no ícone do raio (⚡) para abrir <b>Controlo de energia</b>.",
    "Confirme o <b>limite de carga</b> (entre 50% e 100%) e ative <b>Carregamento agendado</b>.",
    "Defina o início às {inicio} e o fim às {fim}.",
    "Escolha os dias, se a opção existir, e guarde. Deixe <b>Reservar viagem</b> desligado para não juntar outra programação."
  ],
  power:"No ecrã central, em <b>Energia</b> (ou <b>Carregamento</b>), procure <b>Corrente de carga AC</b>. Se não existir, ajuste-a na wallbox.",
  tip:"Se a wallbox também tiver horário, use só um dos dois para evitar falhas."
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
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Carregamento agendado","Desligado"],["val","Limite de carga","90 %"]],hl:[1]},
    {t:"Carregamento agendado",cap:"Carregamento agendado",rows:[["tog","Carregamento agendado",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app}. No separador <b>O meu veículo</b>, deslize para baixo e toque no cartão de <b>Carregamento</b>.",
    "Toque em <b>Carregamento agendado</b> e ative a opção.",
    "Defina o início às {inicio} e o fim às {fim}, escolha os dias e guarde.",
    "No ecrã do carro, a mesma opção está em <b>Energia</b> (ou <b>Nova Energia</b>) › <b>Carregar/Descarregar</b>. Desligue e tranque o carro antes de ligar o cabo."
  ],
  power:"Se o menu de carregamento do carro não tiver opção de corrente, ajuste-a na wallbox.",
  tip:"Os nomes dos menus variam com o modelo e a versão da app. Se, com a wallbox, o carro não começar a carregar à hora marcada, desligue o agendamento no carro e programe o horário na wallbox."
},
cupra:{level:IND, th:"cupra",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · 280 km"],["link","Climatização remota","Desligada"]],hl:[1]},
    {t:"Bateria e carregamento",cap:"Bateria e carregamento",act:"gear",hlAct:1,rows:[["batt",62]],hl:[]},
    {t:"Definições de carregamento",cap:"Definições de carregamento",rows:[["link","Perfis de carregamento","Casa"],["val","Limite de carga","80 %"],["val","Corrente de carga AC","Máxima"]],hl:[0]},
    {t:"Casa",cap:"Perfil «Casa»",rows:[["tog","Horário de carregamento preferencial",1],["time","Início","S"],["time","Fim","E"],["val","Nível mínimo de carga","0 %"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,3],
  steps:[
    "Abra a app {app}, escolha o carro no topo e toque no cartão <b>Carregamento</b>.",
    "No ecrã <b>Bateria e carregamento</b>, toque na roda dentada (definições), no canto superior direito.",
    "Abra os <b>perfis</b> (ou <b>locais</b>) <b>de carregamento</b> e escolha ou crie «Casa».",
    "Ative o <b>horário de carregamento preferencial</b> de {inicio} a {fim}, ponha o nível mínimo a 0% e guarde."
  ],
  power:"Nas definições de carregamento, procure <b>Corrente de carga AC</b> e escolha «Reduzida», se precisar.",
  tip:"O horário só funciona no local onde foi criado. Noutro sítio, o carro carrega logo que é ligado."
},
fiat:{level:IND, th:"fiat",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Bateria","62 % · 280 km"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Programação de carregamento","Desligada"],["link","Procurar carga"]],hl:[1]},
    {t:"Programação",cap:"Programação de carregamento",rows:[["tog","Horário 1",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app}, escolha o carro no topo e toque no cartão da <b>bateria</b>.",
    "Entre em <b>Carregamento</b> e escolha <b>Programação de carregamento</b>.",
    "Ative um horário de {inicio} a {fim}, escolha os dias e guarde.",
    "Ligue o cabo: o carro espera pela hora de início. No ecrã do carro, a mesma opção está no menu <b>Electric</b> (ou <b>Energia</b>)."
  ],
  power:"A maioria destes modelos não permite limitar a corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:"No 600e e no Grande Panda, a app pode mostrar <b>Carregamento diferido</b> só com hora de início. Nesse caso, defina o início às {inicio}: uma carga normal costuma caber no vazio."
},

renault:{level:IND, th:"renault",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Programas","Carregamento e climatização"]],hl:[1]},
    {t:"Programas",cap:"Programas",rows:[["tog","Veículo pronto às 08:00",1],["days"],["link","Definições dos programas","Comuns a todos os programas"]],hl:[2]},
    {t:"Definições dos programas",cap:"Definições dos programas",rows:[["tog","Horas de vazio",1],["time","Início","S"],["time","Fim","E"],["note","Valem para todos os programas."]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,1,2],
  steps:[
    "Na app {app}, no ecrã do veículo, desça até <b>Carregamento e climatização</b> e toque em <b>Programas</b>.",
    "Toque em <b>Definições dos programas</b>. Estas definições valem para todos os programas.",
    "Ative as <b>horas de vazio</b> e defina o início às {inicio} e o fim às {fim}. Guarde.",
    "Ative um programa com a hora a que o carro deve estar pronto e os dias da semana. Sem nenhum dia selecionado, o programa não fica guardado.",
    "Opcional: nas mesmas definições, escolha um <b>nível de carga máximo</b> (por exemplo, 80%)."
  ],
  power:"Se o menu de carregamento do carro (openR link) tiver <b>corrente de carga AC</b>, pode ajustá-la aí. Se não tiver, ajuste-a na wallbox.",
  tip:"O ecrã <b>Programas</b> aparece nas capturas da app. No ZOE e nos modelos mais antigos, a app pode mostrar <b>Carga programada</b> com hora de início e duração: comece às {inicio} e escolha uma duração que termine até às {fim}."
},

dacia:{level:IND, th:"dacia",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Programas","Carregamento e climatização"]],hl:[1]},
    {t:"Programas",cap:"Programas",rows:[["tog","Veículo pronto às 08:00",1],["days"],["link","Definições dos programas","Comuns a todos os programas"]],hl:[2]},
    {t:"Definições dos programas",cap:"Definições dos programas",rows:[["tog","Horas de vazio",1],["time","Início","S"],["time","Fim","E"],["note","Valem para todos os programas."]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,1],
  steps:[
    "Na app {app}, no ecrã do veículo, desça até <b>Carregamento e climatização</b> e toque em <b>Programas</b>. É preciso ter os serviços conectados ativos.",
    "Toque em <b>Definições dos programas</b>. Estas definições valem para todos os programas.",
    "Ative as <b>horas de vazio</b> e defina o início às {inicio} e o fim às {fim}. Guarde.",
    "Ative um programa com a hora a que o carro deve estar pronto e os dias da semana."
  ],
  power:"O Spring não permite limitar a corrente na app. Se for preciso, ajuste-a na wallbox.",
  tip:"O ecrã <b>Programas</b> aparece nas capturas da app. O nome da opção de horas de vazio pode variar com a versão do software. Se não a encontrar, ou se o Spring não tiver serviços conectados, programe o horário na wallbox."
},
mercedes:{level:IND, th:"mercedes",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","280 km · 62 %"]],hl:[1]},
    {t:"Opções de carregamento",cap:"Opções de carregamento: não há hora de início",rows:[["batt",62],["link","Programa de carregamento","Padrão"],["slider","Nível máximo de carga",80],["link","Hora de partida","Desligada"]],hl:[1,2]},
    {t:"Horário de carregamento",k:"wb",th:"wb",cap:"App da wallbox: horário do vazio",rows:[["tog","Carregar só neste horário",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,1,2,2],
  steps:[
    "Na app {app}, no ecrã inicial, toque no cartão da bateria (autonomia e %).",
    "Em <b>Opções de carregamento</b>, escolha o <b>programa de carregamento</b> («Padrão» ou «Casa») e o <b>nível máximo de carga</b>.",
    "A <b>hora de partida</b> só indica quando o carro deve estar pronto. Não define a hora de início do carregamento.",
    "Para carregar só no vazio, programe o horário {inicio}–{fim} na <b>wallbox</b>.",
    "Na primeira noite, confirme que o carregamento começou à hora certa."
  ],
  power:"No ecrã MBUX, em <b>Veículo › Carregamento</b>, procure <b>Corrente de carga AC</b> («máxima», «reduzida» ou «mínima», consoante o modelo).",
  tip:"Nos EQS e EQE (incluindo SUV), o ecrã MBUX pode permitir pausas de carregamento em certas horas. Confirme no manual do carro. Nos restantes modelos, quem controla o horário é a wallbox."
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
volvo:{level:OK, th:"volvo",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","Cabo ligado"]],hl:[1]},
    {t:"Carregamento",cap:"Vista de carregamento",rows:[["batt",62],["val","Limite de carga","90 %"],["link","Horário de carregamento","Desligado"]],hl:[2]},
    {t:"Horário de carregamento",cap:"Horário de carregamento",rows:[["tog","Horário",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no ecrã inicial, toque na autonomia ou no estado de <b>Carregamento</b> para abrir a vista de carregamento.",
    "Toque em <b>Horário de carregamento</b> e adicione um horário.",
    "Defina o início às {inicio} e o fim às {fim}, escolha os dias e guarde.",
    "Confirme que o horário fica ativo. A hora programada aparece na vista de carregamento."
  ],
  power:"No ecrã central, nas definições de carregamento, procure o <b>limite de corrente</b> e escolha o valor pretendido.",
  tip:"Nos C40, EC40, EX30, EX40, EX90 e XC40 elétrico, o horário pode ser criado na app ou no ecrã central. Nos outros modelos, use o ecrã central."
},
polestar:{level:IND, th:"polestar",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",act:"info",rows:[["batt",62],["val","Limite de carga","−  80 %  +"],["tog","Horário · {inicio}–{fim}",1]],hl:[2]},
    {t:"Horário de carregamento",cap:"Horário de carregamento",rows:[["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1]}
  ],
  map:[0,1,2,1],
  steps:[
    "Na app {app}, no ecrã inicial, toque no mosaico <b>Carregamento</b>.",
    "Confirme o <b>limite de carga</b> com os botões − e + (por exemplo, 80%).",
    "Toque no <b>horário</b> e defina o início às {inicio} e o fim às {fim}. Escolha os dias e guarde.",
    "Ative o horário no interruptor. Com o cabo ligado, o carro espera pelo início do vazio."
  ],
  power:"No ecrã central do carro, em <b>Carregamento</b>, procure <b>Corrente de carga AC</b> (ou «limite de corrente»).",
  tip:"Se não vir o horário na app, atualize a app e o software do carro. O horário também pode ser criado no ecrã central, em <b>Carregamento</b>."
},

mg:{level:IND, th:"mg",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Bateria","62 %"],["link","Climatização","Desligada"]],hl:[1]},
    {t:"Gestão de carregamento",cap:"Gestão de carregamento",rows:[["batt",62],["slider","Nível de carga alvo",80],["link","Carregamento agendado","Desligado"]],hl:[2]},
    {t:"Carregamento agendado",cap:"Carregamento agendado",rows:[["tog","Carregamento agendado",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no ecrã inicial, toque no cartão <b>Bateria</b>.",
    "Em <b>Gestão de carregamento</b>, confirme o nível de carga alvo e toque em <b>Carregamento agendado</b>.",
    "Ative a opção, defina o início às {inicio} e o fim às {fim} e escolha a repetição.",
    "Guarde e espere pela mensagem de sucesso. Se o carro estiver sem rede móvel, o envio pode falhar."
  ],
  power:"No ecrã do carro, no menu de carregamento, procure o <b>limite de corrente AC</b>. Se não existir, ajuste-a na wallbox.",
  tip:"Com o horário ativo, o carro também espera por ele em postos públicos AC. Antes de carregar fora de casa, desative-o na app. Se a wallbox também tiver horário, use só um dos dois."
},
ford:{level:IND, th:"ford",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"]],hl:[],hlTab:1},
    {t:"Carregamento",cap:"Separador de carregamento (raio)",tab:1,rows:[["batt",62],["link","Procurar carga pública"],["link","Configurações de carga"]],hl:[2]},
    {t:"Configurações de carga",cap:"Configurações de carga",rows:[["sect","Locais guardados"],["link","Casa","Local de carregamento"]],hl:[1]},
    {t:"Casa",cap:"Local «Casa»",rows:[["tog","Horários de carregamento preferidos",1],["time","Início","S"],["time","Fim","E"],["val","Nível de carga","80 %"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,3],
  steps:[
    "Abra a app {app} (antiga FordPass) e toque no separador do <b>raio</b>, em baixo.",
    "Desça até <b>Configurações de carga</b>.",
    "Escolha o local <b>Casa</b>. Se não existir, adicione-o com o carro estacionado em casa.",
    "Ative os <b>horários de carregamento preferidos</b>, defina {inicio}–{fim} e guarde."
  ],
  power:"Em alguns modelos, o ecrã do carro tem <b>Corrente de carga AC</b>. Nos restantes, ajuste-a na wallbox.",
  tip:""
},
toyota:{level:IND, th:"toyota",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","Cabo ligado"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Horário de carregamento","Sem horários"]],hl:[1]},
    {t:"Novo horário",cap:"Horário de carregamento",rows:[["seg",["Hora de início","Hora de partida"],0],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no ecrã do carro, toque no cartão <b>Carregamento</b>.",
    "Abra o <b>horário de carregamento</b> e toque em <b>+</b> para criar um horário.",
    "Escolha <b>Hora de início</b> e defina o início às {inicio} e o fim às {fim}.",
    "Escolha os dias, guarde e confirme que o horário fica ativo."
  ],
  power:"Normalmente a app não permite limitar a corrente. Se for preciso, ajuste-a na wallbox.",
  tip:"Também pode criar o horário no ecrã do carro, nas definições de carregamento. Evite a opção <b>Hora de partida</b>: para chegar à carga pedida a tempo, o carro pode carregar fora do vazio."
},
nissan:{level:IND, th:"nissan",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Bateria","Cabo ligado"]],hl:[1]},
    {t:"Bateria",cap:"Bateria",rows:[["batt",62],["link","Temporizadores de carga","Desligados"]],hl:[1]},
    {t:"Temporizador 1",cap:"Temporizador de carga",rows:[["tog","Temporizador 1",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no ecrã inicial, toque no cartão <b>Bateria</b>.",
    "Abra os <b>temporizadores de carga</b>. Pode guardar até três.",
    "No <b>Temporizador 1</b>, defina o início às {inicio} e o fim às {fim}.",
    "Escolha os dias, guarde e confirme que o temporizador fica ativo."
  ],
  power:"A app não permite limitar a corrente. Se for preciso, ajuste-a na wallbox.",
  tip:"Este guia é para o ARIYA e o novo LEAF. Nos LEAF até 2025, use a app <b>NissanConnect EV &amp; Services</b> ou o ecrã do carro (<b>Temporizador de carga</b>). Se a wallbox também tiver horário, use só um dos dois para evitar falhas."
},
porsche:{level:IND, th:"porsche",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Bateria","Partida: amanhã, 08:00"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento › Partida",act:"gear",rows:[["seg",["Visão geral","Partida"],1],["batt",62],["link","Perfil de carregamento","Geral"]],hl:[0,2]},
    {t:"Perfil de carregamento",cap:"Perfil de carregamento",rows:[["tog","Horário de carregamento preferencial",1],["time","Início","S"],["time","Fim","E"],["slider","Carga mínima",25]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no separador <b>Veículo</b>, toque no cartão <b>Bateria</b> para abrir <b>Carregamento</b>.",
    "Toque em <b>Partida</b> e abra o <b>perfil de carregamento</b>. O ideal é criar um perfil «Casa» com a localização de casa.",
    "No perfil, ative o <b>horário de carregamento preferencial</b> e defina o início às {inicio} e o fim às {fim}.",
    "Defina uma <b>carga mínima</b> baixa (por exemplo, 25%) e guarde. Até esse nível, o carro carrega logo que o cabo é ligado; o resto fica para o vazio."
  ],
  power:"No ecrã PCM, no perfil de carregamento, procure <b>Corrente de carga máxima</b> (AC) e escolha um valor mais baixo.",
  tip:"Se tiver uma <b>hora de partida</b> ativa, o carro pode começar antes do vazio para chegar à carga pedida a tempo. Escolha uma partida depois das {fim}. Nas versões mais recentes do software, o horário preferencial pode estar em <b>Carregamento otimizado › Manual</b>."
},
honda:{level:IND, th:"honda",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"]],hl:[],hlTab:3},
    {t:"Painel",cap:"Separador Painel",tab:3,rows:[["link","Estado do carregamento"],["link","Segurança do veículo","Tudo fechado"],["link","Definições de climatização"]],hl:[0]},
    {t:"Estado do carregamento",cap:"Estado do carregamento",rows:[["batt",62],["val","Velocidade de carga","Normal"],["link","Horário de carregamento","Desligado"]],hl:[2]},
    {t:"Horário de carregamento",cap:"Horário de carregamento",rows:[["tog","Horário 1",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,3],
  steps:[
    "Na app {app}, abra o separador <b>Painel</b>.",
    "Toque em <b>Estado do carregamento</b>.",
    "Toque em <b>Horário de carregamento</b>.",
    "Adicione um horário das {inicio} às {fim}, escolha os dias e guarde."
  ],
  power:"Na maioria das versões não há limite de corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:"Depois de usar <b>Carregar agora</b> fora do horário, confirme na app que o horário continua ativo. Também pode programar no ecrã do carro, nas definições de carregamento."
},
mazda:{level:IND, th:"mazda",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"]],hl:[1]},
    {t:"Temporizador de carga",cap:"Temporizador de carga",rows:[["tog","Temporizador de carga",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,1,1],
  steps:[
    "Abra a app {app}, escolha o carro e toque em <b>Carregamento</b>.",
    "Abra o <b>temporizador de carga</b> (no 6e e CX-6e: <b>Carregamento agendado</b>) e ative-o.",
    "Defina {inicio}–{fim}, escolha os dias e guarde.",
    "No ecrã do carro, o mesmo está em <b>Definições › Veículo › Carregamento</b> (MX-30) ou <b>Energia › Carregamento agendado</b> (6e e CX-6e)."
  ],
  power:"Procure <b>Corrente de carga AC</b> no menu de carregamento do carro. Se não existir, ajuste-a na wallbox.",
  tip:"Os nomes dos menus vêm do manual e podem variar com a versão da app. Se não encontrar a opção, programe o horário na wallbox."
},
jlr:{level:IND, th:"jlr",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento"],["link","Remote"],["link","Localização"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Definições de carregamento"]],hl:[1]},
    {t:"Definições de carregamento",cap:"Definições de carregamento",rows:[["tog","Carregamento fora das horas de ponta",1],["time","Início","S"],["time","Fim","E"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app} e, no ecrã inicial, toque em <b>Carregamento</b>.",
    "Entre em <b>Definições de carregamento</b>.",
    "Ative o <b>carregamento fora das horas de ponta</b> e defina o início às {inicio} e o fim às {fim}.",
    "Guarde e confirme no ecrã do carro."
  ],
  power:"No ecrã do carro, nas definições de carregamento, procure <b>Limite de corrente de carga</b>.",
  tip:""
},
jeep:{level:IND, th:"jeep",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Autonomia","62 % · 280 km"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Programação de carregamento","Desligada"],["link","Procurar carregamento"]],hl:[1]},
    {t:"Programação",cap:"Programação de carregamento",rows:[["tog","Horário 1",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app}, escolha o carro no topo e toque no cartão da <b>autonomia</b> (km estimados).",
    "Entre em <b>Carregamento</b> e escolha <b>Programação de carregamento</b>.",
    "Ative um horário de {inicio} a {fim}, escolha os dias e guarde.",
    "Ligue o cabo: o carro espera pela hora de início. No ecrã do carro, a mesma opção está no menu <b>Electric</b> (ou <b>Energia</b>)."
  ],
  power:"A maioria destes modelos não permite limitar a corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:"No Avenger, a app pode mostrar <b>Carregamento diferido</b> só com hora de início. Nesse caso, defina o início às {inicio}: uma carga normal costuma caber no vazio."
},
maserati:{level:IND, th:"maserati",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Autonomia","280 km"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Programação de carregamento","Desligada"]],hl:[1]},
    {t:"Programação",cap:"Programação de carregamento",rows:[["tog","Horário 1",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app} e, no ecrã inicial, toque no cartão da <b>autonomia</b>.",
    "Entre em <b>Programação de carregamento</b>.",
    "Ative um horário de {inicio} a {fim}, escolha os dias e guarde.",
    "Ligue o cabo: o carro espera pela hora de início. No ecrã central, a mesma opção está nas definições de carregamento."
  ],
  power:"No ecrã central, nas definições de carregamento, procure o limite de corrente AC. Se não existir, ajuste-a na wallbox.",
  tip:""
},
kia:{level:IND, th:"kia",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Carregamento programado","Desligado"],["slider","Limite de carga (CA)",80]],hl:[1]},
    {t:"Carregamento programado",cap:"Horário fora das horas de ponta",rows:[["tog","Horário fora das horas de ponta",1],["time","Início","S"],["time","Fim","E"],["seg",["Dar prioridade","Só fora de ponta"],1]],btn:"OK",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app} e toque no <b>raio</b> (⚡), na barra de atalhos do ecrã inicial.",
    "Entre em <b>Carregamento programado</b>.",
    "Ative o <b>horário fora das horas de ponta</b>, defina {inicio}–{fim} e escolha <b>Carregar apenas fora das horas de ponta</b>.",
    "Confirme com <b>OK</b> e espere pela mensagem de confirmação. No ecrã do carro, o caminho é <b>EV › Gestão de carregamento</b>."
  ],
  power:"No ecrã do carro, em <b>EV › Gestão de carregamento</b>, procure <b>Corrente de carga CA</b> e escolha um valor mais baixo.",
  tip:"Com <b>Dar prioridade</b>, o carro pode continuar a carregar fora do vazio para chegar ao limite. Com <b>Só fora de ponta</b>, carrega apenas no horário definido."
},
leap:{level:IND, th:"leap",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Centro de carregamento"]],hl:[1]},
    {t:"Centro de carregamento",cap:"Centro de carregamento",rows:[["batt",62],["slider","Limite superior de carga",80],["tog","Plano de carregamento",0]],hl:[2]},
    {t:"Plano de carregamento",cap:"Plano de carregamento",rows:[["tog","Plano de carregamento",1],["time","Início","S"],["time","Fim","E"],["note","Repete todos os dias. Só funciona em carregamento lento (AC)."]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app} e, no ecrã inicial, toque em <b>Centro de carregamento</b> (por baixo da autonomia).",
    "Ative o <b>Plano de carregamento</b>. Confirme também o <b>limite superior de carga</b>.",
    "Defina o início às {inicio} e o fim às {fim} e guarde.",
    "Ligue o cabo: o carro espera pela hora marcada e repete o plano todos os dias."
  ],
  power:"O plano só funciona em carregamento AC. No ecrã central, procure as definições de carregamento para limitar a corrente. Se não existir, ajuste-a na wallbox.",
  tip:"Se a app só pedir a hora de início, defina {inicio}: uma carga normal costuma caber no vazio."
},
lexus:{level:IND, th:"lexus",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Bateria","62 %"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Programação de carregamento","Desligada"]],hl:[1]},
    {t:"Programação de carregamento",cap:"Programação de carregamento",rows:[["tog","Horário",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app} e, no ecrã inicial, toque na <b>percentagem da bateria</b>.",
    "Entre em <b>Programação de carregamento</b> e crie um novo horário.",
    "Defina o início às {inicio} e o fim às {fim}, escolha os dias e ative o horário.",
    "Guarde e ligue o cabo: o carro espera pela hora de início."
  ],
  power:"Normalmente não há limite de corrente na app. Se for preciso, ajuste-a na wallbox.",
  tip:"No UX 300e, a app deixa escolher a hora de início <b>ou</b> a hora de fim, mas não as duas. Escolha a hora de início às {inicio}: uma carga normal costuma caber no vazio."
},
lotus:{level:IND, th:"lotus",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Definições de energia","62 % · 280 km"],["link","Climatização"]],hl:[1]},
    {t:"Definições de energia",cap:"Definições de energia",rows:[["batt",62],["slider","Limite de carga",80],["link","Carregamento agendado","Desligado"]],hl:[2]},
    {t:"Carregamento agendado",cap:"Carregamento agendado",rows:[["tog","Carregamento agendado",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app} e, no ecrã inicial, toque no cartão <b>Definições de energia</b>.",
    "Entre em <b>Carregamento agendado</b>.",
    "Ative o agendamento, defina o início às {inicio} e o fim às {fim} e escolha os dias.",
    "Guarde. No ecrã central do carro, a mesma opção está nas definições de carregamento."
  ],
  power:"No ecrã central, nas definições de carregamento, procure <b>Corrente de carga AC</b>. Se não existir, ajuste-a na wallbox.",
  tip:""
},
lucid:{level:IND, th:"lucid",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 %"],["link","Climatização","Desligada"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["slider","Limite de carga",80],["seg",["Diário","Viagem"],0],["link","Horário de carregamento","Desligado"]],hl:[2]},
    {t:"Horário de carregamento",cap:"Horário de carregamento",rows:[["tog","Horário de carregamento",1],["time","Início","S"],["time","Fim","E"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app} e, no ecrã inicial, toque em <b>Carregamento</b>.",
    "Desça até <b>Horário de carregamento</b>. Confirme também o limite de carga.",
    "Ative o horário, defina o início às {inicio} e o fim às {fim} e guarde.",
    "Ligue o cabo: o carro espera pela hora de início. O mesmo menu está no ecrã do carro, em <b>Carregamento</b>."
  ],
  power:"No ecrã do carro, em <b>Carregamento</b>, procure o limite de corrente AC. Se não existir, ajuste-a na wallbox.",
  tip:""
},
lynk:{level:IND, th:"lynk",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Bateria"],["link","Climatização"],["link","Portas e janelas","Tudo fechado"]],hl:[1]},
    {t:"Bateria",cap:"Bateria",rows:[["batt",62],["sect","Preferências"],["tog","Horário de carregamento",0],["val","Limite de carga","80 %"]],hl:[2]},
    {t:"Horário de carregamento",cap:"Horário de carregamento",rows:[["tog","Horário de carregamento",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app} e, no ecrã inicial, toque em <b>Bateria</b>.",
    "Em <b>Preferências</b>, toque em <b>Horário de carregamento</b>.",
    "Defina o início às {inicio} e o fim às {fim}, escolha os dias e ative o horário.",
    "Guarde e ligue o cabo: o carro espera pela hora de início."
  ],
  power:"No ecrã central do carro, nas definições de carregamento, procure o limite de corrente AC. Se não existir, ajuste-a na wallbox.",
  tip:""
},
mini:{level:IND, th:"mini",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Estado de carga","62 % · 280 km"]],hl:[1]},
    {t:"Eletromobilidade",cap:"Eletromobilidade",rows:[["sect","Carregamento"],["link","Plano de carregamento"],["link","Temporizador de carga e climatização","Definir modo de carregamento e hora de partida"],["link","Procurar posto de carregamento"],["sect","Estatísticas"],["link","Histórico de carregamento"]],hl:[2]},
    {t:"Modo de carregamento",cap:"Modo de carregamento",rows:[["radio","Carregar imediatamente",0],["radio","Carregar no intervalo de tempo",1],["time","Início","S"],["time","Fim","E"]],btn:"Guardar",hl:[1,2,3]},
    {t:"Hora de partida",cap:"Hora de partida (obrigatória)",rows:[["tog","Partida 1",1],["time","Hora de partida","E"],["days"],["tog","Climatização",0],["warn","Sem uma partida ativa, o intervalo de tempo não é aplicado."]],btn:"Guardar",hl:[0,1]}
  ],
  map:[0,1,2,3,1],
  steps:[
    "Na app {app}, no ecrã inicial, toque em <b>Estado de carga</b> para abrir a <b>Eletromobilidade</b>.",
    "Em <b>Carregamento</b>, toque em <b>Temporizador de carga e climatização</b>.",
    "Em <b>Modo de carregamento</b>, escolha <b>Carregar no intervalo de tempo</b> e defina o início às {inicio} e o fim às {fim}.",
    "Ative uma <b>hora de partida</b> às {fim} para os dias em que quer carregar. Sem uma partida ativa, o intervalo não é aplicado.",
    "Em <b>Plano de carregamento</b>, confirme o horário. Ao ligar o cabo, o carro pode carregar alguns minutos e depois parar até à hora de início. É normal."
  ],
  power:"No ecrã do carro, no menu de <b>carregamento</b>, procure o limite de <b>corrente de carga AC</b>. Se não existir, ajuste-a na wallbox.",
  tip:"Os ecrãs mostrados são da app MINI para o Cooper SE. Nos MINI mais recentes (Cooper, Aceman e Countryman desde 2024), a app tem outro aspeto, mas as opções são semelhantes. Tal como no BMW, o carro dá prioridade a atingir a carga até à hora de partida."
},
alpine:{level:IND, th:"alpine",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Programas","Carregamento e climatização"]],hl:[1]},
    {t:"Programas",cap:"Programas",rows:[["tog","Veículo pronto às 08:00",1],["days"],["link","Definições dos programas","Comuns a todos os programas"]],hl:[2]},
    {t:"Definições dos programas",cap:"Definições dos programas",rows:[["tog","Horas de vazio",1],["time","Início","S"],["time","Fim","E"],["note","Valem para todos os programas."]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,1],
  steps:[
    "Na app {app}, no ecrã do veículo, desça até <b>Carregamento e climatização</b> e toque em <b>Programas</b>.",
    "Toque em <b>Definições dos programas</b>. Estas definições valem para todos os programas.",
    "Ative as <b>horas de vazio</b> e defina o início às {inicio} e o fim às {fim}. Guarde.",
    "Ative um programa com a hora a que o carro deve estar pronto e os dias da semana."
  ],
  power:"No ecrã do carro (openR link), no menu de carregamento, procure o limite de corrente AC. Se não existir, ajuste-a na wallbox.",
  tip:"O ecrã <b>Programas</b> aparece nas capturas da app. O nome da opção de horas de vazio pode variar com a versão do software. Se não a encontrar, programe o horário na wallbox."
},
bentley:{level:IND, th:"bentley",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · 280 km"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["slider","Limite de carga",80],["link","Temporizadores de carregamento","Desligado"]],hl:[2]},
    {t:"Temporizador 1",cap:"Temporizador de carregamento",rows:[["tog","Temporizador 1",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no <b>Painel</b>, toque no cartão da autonomia.",
    "Em <b>Carregamento</b>, abra os <b>temporizadores de carregamento</b>.",
    "Ative um temporizador, defina o início às {inicio} e o fim às {fim} e escolha os dias.",
    "Guarde e ligue o cabo. Na primeira noite, confirme que o carregamento começou à hora certa."
  ],
  power:"No ecrã do carro, no menu de carregamento, procure o limite de corrente AC. Se não existir, ajuste-a na wallbox.",
  tip:"É o primeiro Bentley 100% elétrico e as capturas da app ainda não mostram o menu de carregamento. Os nomes podem mudar. Se não encontrar a opção, programe o horário na wallbox."
},
gwm:{level:IND, th:"gwm",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Programa de carregamento","62 % · Cabo ligado"]],hl:[1]},
    {t:"Programa de carregamento",cap:"Programa de carregamento",rows:[["batt",62],["tog","Carregamento agendado",0],["warn","Não se aplica ao carregamento rápido (DC)."]],hl:[1]},
    {t:"Carregamento agendado",cap:"Carregamento agendado",rows:[["tog","Carregamento agendado",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no ecrã inicial, toque na autonomia para abrir o <b>Programa de carregamento</b>.",
    "Toque em <b>Carregamento agendado</b>.",
    "Ative a opção, defina o início às {inicio} e o fim às {fim} e escolha os dias.",
    "Guarde e ligue o cabo. O horário só se aplica ao carregamento AC (em casa)."
  ],
  power:"No ecrã do carro, nas definições de carregamento, procure o limite de corrente AC. Se não existir, ajuste-a na wallbox.",
  tip:""
},
seat:{level:IND, th:"seat",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · 160 km"]],hl:[1]},
    {t:"Bateria e carregamento",cap:"Bateria e carregamento",act:"gear",rows:[["batt",62],["slider","Carga máxima",80],["link","Temporizadores","Desligados"]],hl:[2]},
    {t:"Temporizador 1",cap:"Temporizador",rows:[["tog","Horário de carregamento preferencial",1],["time","Início","S"],["time","Fim","E"],["val","Hora de partida","08:00"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no ecrã do veículo, toque no cartão <b>Carregamento</b>.",
    "Em <b>Bateria e carregamento</b>, defina a <b>carga máxima</b> e abra os <b>temporizadores</b>.",
    "Num temporizador, ative o <b>horário de carregamento preferencial</b> de {inicio} a {fim}.",
    "Defina a <b>hora de partida</b> (depois das {fim}), escolha os dias e guarde. O temporizador tem de ficar ativo."
  ],
  power:"No ecrã do carro, no menu de carregamento, pode existir a opção de <b>corrente de carga reduzida</b>. Se não existir, ajuste-a na wallbox.",
  tip:"As capturas da app são de um SEAT Leon híbrido. No Mii electric, os nomes dos menus podem variar. Se não encontrar os temporizadores, programe o horário na wallbox."
},
audi:{level:IND, th:"audi",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["slider","Nível de carga",80],["link","Temporizadores","Temporizador 1 · 08:00"]],hl:[2]},
    {t:"Temporizador 1",cap:"Temporizador",rows:[["tog","Horário de carregamento preferencial",1],["time","Início","S"],["time","Fim","E"],["val","Hora de partida","08:00"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no ecrã do carro, toque no cartão <b>Carregamento</b>.",
    "Defina o <b>nível de carga</b> (por exemplo, 80%) e abra os <b>temporizadores</b>. Se a lista estiver vazia, crie primeiro um temporizador no ecrã do carro (MMI), em <b>Carregamento › Horas de partida</b>.",
    "No temporizador, ative o <b>horário de carregamento preferencial</b> e defina o início às {inicio} e o fim às {fim}.",
    "Defina a <b>hora de partida</b> depois das {fim}, escolha os dias e ative o temporizador. Sem um temporizador ativo, o carro carrega logo que é ligado."
  ],
  power:"No ecrã MMI, no menu <b>Carregamento</b>, procure <b>Corrente de carga máxima</b> (AC) e escolha «reduzida».",
  tip:"No Q4 e-tron, o horário preferencial pode estar em <b>Locais de carregamento</b>: crie o local «Casa» e defina aí o horário."
},
citroen:{level:OK, th:"citroen",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","Imediato"],["link","Climatização","Desligada"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento diferido",rows:[["batt",62],["seg",["Imediato","Diferido"],1],["time","Programação do carregamento diferido","S"]],hl:[1,2]}
  ],
  map:[0,1,1,1],
  steps:[
    "Na app {app}, no separador inicial, toque em <b>Carregamento</b>.",
    "Mude de <b>Imediato</b> para <b>Diferido</b>.",
    "Em <b>Programação do carregamento diferido</b>, toque no lápis (✎) e defina a hora de início: {inicio}.",
    "Ligue o cabo. O carro espera até às {inicio} e depois carrega até ficar cheio."
  ],
  power:"A maioria destes modelos não permite limitar a corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:"A app só deixa escolher a hora de início. Uma carga normal costuma caber no vazio, que termina às {fim}. Se precisar de garantir que o carregamento para às {fim}, use o horário da wallbox."
},
ds:{level:OK, th:"ds",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","Imediato"],["link","Climatização","Desligada"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento diferido",rows:[["batt",62],["seg",["Imediato","Diferido"],1],["time","Programação do carregamento diferido","S"],["tog","Limitação de carga a 80 %",1]],hl:[1,2,3]}
  ],
  map:[0,1,1,1],
  steps:[
    "Na app {app}, no separador inicial, toque em <b>Carregamento</b>.",
    "Mude de <b>Imediato</b> para <b>Diferido</b>.",
    "Em <b>Programação do carregamento diferido</b>, toque no lápis (✎) e defina a hora de início: {inicio}.",
    "Se existir, ative a <b>limitação de carga a 80%</b>. Ajuda a terminar dentro do vazio e poupa a bateria."
  ],
  power:"A maioria destes modelos não permite limitar a corrente no carro. Se for preciso, ajuste-a na wallbox.",
  tip:"A app só deixa escolher a hora de início: o carro carrega desde as {inicio} até ao limite. Se precisar de garantir que o carregamento para às {fim}, use o horário da wallbox."
},
hyundai:{level:IND, th:"hyundai",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Cobrança","62 % · Cabo ligado"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["link","Carregamento programado","Desligado"],["slider","Limite de carga (CA)",80]],hl:[1]},
    {t:"Carregamento programado",cap:"Horário fora das horas de ponta",rows:[["tog","Horário fora das horas de ponta",1],["time","Início","S"],["time","Fim","E"],["seg",["Dar prioridade","Só fora de ponta"],1]],btn:"OK",hl:[0,1,2,3]}
  ],
  map:[0,1,2,2],
  steps:[
    "Abra a app {app} e, no ecrã <b>Início</b>, toque no atalho ⚡ (na app aparece como <b>Cobrança</b>).",
    "Entre em <b>Carregamento programado</b>.",
    "Ative o <b>horário fora das horas de ponta</b>, defina {inicio}–{fim} e escolha <b>Só fora de ponta</b>.",
    "Confirme com <b>OK</b> e espere pela mensagem de confirmação. No ecrã do carro, o caminho é <b>EV › Gestão de carregamento</b>."
  ],
  power:"No ecrã do carro, em <b>EV › Gestão de carregamento</b>, procure <b>Corrente de carga CA</b> e escolha um valor mais baixo.",
  tip:"O carregamento programado só começa se o cabo já estiver ligado à hora marcada. Com <b>Dar prioridade</b>, o carro pode carregar fora do vazio para chegar ao limite."
},
smart:{level:IND, th:"smart",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Bateria"]],hl:[1]},
    {t:"Bateria",cap:"Cartão Bateria aberto",rows:[["batt",62],["tog","Carregamento agendado",0]],hl:[1]},
    {t:"Carregamento agendado",cap:"Carregamento agendado",rows:[["tog","Carregamento agendado",1],["time","Início","S"],["time","Fim","E"]],btn:"Guardar",hl:[1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "<b>smart #1, #3 e #5:</b> na app {app}, no ecrã inicial, toque no cartão <b>Bateria</b> para o abrir.",
    "Confirme o <b>limite de carga</b> (por exemplo, 80%) e ative <b>Carregamento agendado</b>.",
    "Defina o início às {inicio} e o fim às {fim} e guarde.",
    "<b>EQ fortwo e forfour:</b> estes modelos só deixam definir a hora de partida. Para carregar só no vazio, use o horário da wallbox."
  ],
  power:"No ecrã central, em <b>Energia</b>, procure <b>Corrente de carga AC</b>.",
  tip:"Também pode programar o carregamento no ecrã central, em <b>Energia</b>."
},
xpeng:{level:IND, th:"xpeng",
  screens:[
    {t:"",cap:"Ecrã inicial da app",rows:[["hero"],["link","Carregamento","62 % · Cabo ligado"]],hl:[1]},
    {t:"Carregamento",cap:"Carregamento",rows:[["batt",62],["slider","Limite de carga",80],["link","Reserva de carregamento","Desligada"]],hl:[2]},
    {t:"Reserva de carregamento",cap:"Reserva de carregamento",rows:[["tog","Reserva",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[0,1,2]}
  ],
  map:[0,1,2,2],
  steps:[
    "Na app {app}, no ecrã do carro, toque em <b>Carregamento</b>.",
    "Toque em <b>Reserva de carregamento</b> (em algumas versões, <b>Carregamento agendado</b>).",
    "Ative a reserva e defina o início às {inicio} e o fim às {fim}.",
    "Escolha os dias e guarde. No ecrã central, o mesmo menu está em <b>Energia › Carregamento</b>."
  ],
  power:"No ecrã central, em <b>Energia › Carregamento</b>, procure <b>Corrente de carga AC</b>.",
  tip:"As imagens públicas da app não mostram o ecrã de carregamento, por isso o nome do menu pode ser diferente."
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
    "Se o modelo tiver cabo <b>Tipo 2</b>, ligue-o à wallbox e programe nela o horário {inicio}–{fim}.",
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

/* Cada passo tem um ecrã com uma diferença visível: quando dois passos usam o mesmo ecrã,
   o segundo recebe um estado próprio (seletor de hora, "guardado", cabo ligado, a carregar…) */
(function(){
  const nz=x=>String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const clean=x=>nz(String(x).replace(/<[^>]+>/g," ").replace(/\{\w+\}/g," ").replace(/\s+/g," "));
  const WB={t:"Horário de carregamento",cap:"Horário de carregamento",k:"wb",th:"wb",rows:[["tog","Carregar só neste horário",1],["time","Início","S"],["time","Fim","E"],["days"]],btn:"Guardar",hl:[1,2]};
  const TOAST={saved:["check","Horário guardado"],plug:["plug","Cabo ligado · início às {inicio}"],done:["clock","Carregamento agendado · {inicio}–{fim}"],charging:["bolt","A carregar desde as {inicio}"]};
  function hitsFor(base,txt){
    const h=[]; let tog=-1;
    base.rows.forEach((r,j)=>{
      if(r[0]==="tog"&&tog<0) tog=j;
      if(r[0]==="days"){ if(/\bdias\b/.test(txt)) h.push(j); return; }
      if(r[0]==="seg"&&Array.isArray(r[1])){ if(r[1].some(o=>{const w=clean(o).split(/\W+/).filter(x=>x.length>3); return w.length&&w.every(x=>txt.includes(x));})) h.push(j); return; }
      if(typeof r[1]!=="string"||!/^(link|tog|time|val|slider|radio)$/.test(r[0])) return;
      const c=clean(r[1]).replace(/[·:\s]+$/,"").trim();
      if(c.length>3&&txt.includes(c)) h.push(j);
    });
    if(tog>=0&&/\bativ/.test(txt)&&!h.some(j=>base.rows[j][0]==="tog")) h.unshift(tog);
    return h;
  }
  function make(state,base,txt,hits){
    const same=hits.length&&JSON.stringify(hits)===JSON.stringify(base.hl||[]);
    const nh=same?[]:hits;
    const v=Object.assign({},base,{hl:nh.slice()});
    delete v.toast; delete v.sheet; delete v.hlBtn;
    if(state==="wb") return Object.assign({},WB);
    if(state==="hl"){ if(!nh.length) return null; return v; }
    if(state==="maxsoc"){
      const at=base.rows.length&&base.rows[base.rows.length-1][0]==="note"?base.rows.length-1:base.rows.length;
      v.rows=base.rows.slice(0,at).concat([["slider","Nível máximo de carga",80]],base.rows.slice(at)); v.hl=[at]; return v;
    }
    if(state==="pick"){
      const isT=r=>r[0]==="time"||(r[0]==="val"&&/^\d{1,2}:\d{2}$/.test(String(r[2])));
      const tr=base.rows.map((r,j)=>isT(r)?j:-1).filter(j=>j>=0); if(!tr.length) return null;
      const wantE=/\bfim\b|termin/.test(txt)&&!/\binicio\b|comec/.test(txt);
      const j=tr.find(j=>hits.includes(j))??tr.find(j=>base.rows[j][2]===(wantE?"E":"S"))??tr[0];
      v.hl=[j]; v.sheet={l:base.rows[j][1],v:base.rows[j][2]}; return v;
    }
    if(state==="saved"){ if(!base.btn) return null; v.hlBtn=1; }
    v.toast=TOAST[state]; return v;
  }
  Object.keys(GUIDES).forEach(k=>{
    const g=GUIDES[k]; if(!g.map||!g.screens) return;
    g.nb=g.screens.length;
    const used=new Set(), seen=new Set();
    g.map=g.map.map((m,i)=>{
      const base=g.screens[m]; if(!base) return m;
      if(!seen.has(m)){ seen.add(m); used.add(JSON.stringify(base)); return m; }
      const txt=clean(g.steps[i]||""), hits=hitsFor(base,txt), c=[];
      if(/wallbox/.test(txt)&&(base.k||g.k)!=="wb") c.push("wb");
      if(/nivel de carga maximo|carga maxima|limite de carga/.test(txt)&&!hits.some(j=>/slider|val/.test(base.rows[j][0]))&&!base.rows.some(r=>r[0]==="slider")) c.push("maxsoc");
      if(/lapis|defina a hora|toque na hora/.test(txt)) c.push("pick");
      if(/primeira noite|comecou/.test(txt)) c.push("charging");
      if(/\bguard[ea]\b|\bok\b|\benvie\b/.test(txt)) c.push("saved");
      if(/ligue o cabo|ligar o cabo|cabo ligado|o carro espera|espera pel/.test(txt)) c.push("plug");
      if(/confirme|mensagem|fica ativ|aparece/.test(txt)) c.push("saved","done");
      if(/\bdefina\b|escolha|selecione/.test(txt)) c.push("hl","pick");
      c.push("hl","done","saved","plug","charging","pick");
      for(const st of c){
        const v=make(st,base,txt,hits); if(!v) continue;
        const sig=JSON.stringify(v); if(used.has(sig)) continue;
        used.add(sig); v.st=st; g.screens.push(v); return g.screens.length-1;
      }
      return m;
    });
  });
})();


const TOP=["Tesla","BYD","Peugeot","BMW","Renault","Citroën","Mercedes-Benz","Volvo","Volkswagen","Kia","MG","XPENG"];
const ALIAS={"KGM":"SsangYong","Changan":"Deepal","GWM":"ORA Great Wall","Lynk&Co":"Lynk & Co","Mercedes-Benz":"Mercedes","Volkswagen":"VW","DS Automobiles":"DS","Smart":"Hello smart","Forthing":"Dongfeng"};

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
  "My CUPRA":["com.cupra.mycupra","1576693756"],
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
  "My Honda+":["com.honda_eu.connected.app",""],
  "Lynk & Co":["com.lynkco.prod.lynkco_app_android",""],
  "Lotus Cars":["com.lotus.carsdomestic.intl",""],
  "Maserati Connect":["com.fca.myconnect.maseraticonnect",""],
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
const PHOTO={"Abarth|500e":"e:Abarth_500e_Hatchback|1903","Abarth|600e":"e:Abarth_600e|3056","Alfa Romeo|Junior Elettrica":"w:Alfa_Romeo_Junior_(cropped).jpg","Alpine|A290":"w:Alpine_A290_GTS_–_f_15022025.jpg","Alpine|A390":"w:Alpine_A390_GT_–_f_11042026.jpg","Audi|A2 e-tron":"w:Audi_A2_e-tron_Auto_Zuerich_2026_IMG_8601.jpg","Audi|A6 e-tron":"w:Audi_A6_Avant_e-tron_–_f_18042025.jpg","Audi|e-tron GT":"w:Audi_e-tron_GT_IMG_5689.jpg","Audi|Q4 e-tron":"w:2021_Audi_Q4_e-tron_Sport_35.jpg","Audi|Q6 e-tron":"w:Audi_Q6_e-tron_DSC_7829.jpg","Audi|e-tron / Q8 e-tron":"w:2020_Audi_e-Tron_Sport_50_Quattro.jpg","Bentley|Torcal":"w:Bentley_Torcal_Auto_Zuerich_2026_IMG_8654.jpg","BMW|i3":"w:BMW_i3_50_xDrive_First_Edition_(NA0)_–_f2_20082026.jpg","BMW|i4":"w:BMW_i4_IMG_6695.jpg","BMW|i5":"w:BMW_G60_520i_1X7A2443.jpg","BMW|i7":"w:BMW_7-Series_(G70)_750e_IMG_9358.jpg","BMW|iX":"w:BMW_iX_IAA_2021_1X7A0204.jpg","BMW|iX1":"e:BMW_iX1_2022|3458","BMW|iX2":"w:BMW_U10_1X7A2456.jpg","BMW|iX3":"w:BMW_iX3_50_xDrive_M_Sportpaket_Pro_(NA5)_–_f_17052026.jpg","BMW|iX4":"w:BMW_iX4_M60_xDrive_in_der_BMW_Welt_Bild_2_2026-10-18.jpg","BMW|iX5":"w:BMW_iX5_60_xDrive_Auto_Zuerich_2026_IMG_9154.jpg","BYD|ATTO 2":"w:BYD_Atto_2_IAA_2025_DSC_2131.jpg","BYD|ATTO 3":"w:BYD_Atto_3_1X7A6491.jpg","BYD|DOLPHIN":"w:2021_BYD_Dolphin_EV_(front).jpg","BYD|DOLPHIN SURF":"e:BYD_DOLPHIN_SURF|3195","BYD|SEAL":"w:2022_BYD_Seal.jpg","BYD|SEAL U":"w:2023_BYD_Song_Plus_DM-i_(front).jpg","BYD|SEALION 7":"w:2025_BYD_Sealion_7_Performance_front.jpg","BYD|TANG":"w:BYD_Tang_DM-p_front_quarter_trimmed_2.jpg","BYD|HAN":"w:2023_BYD_Han_DM-i_(facelift),_front_8.17.23.jpg","BYD|e6":"w:2023_BYD_e6_SNF7478L_front.jpg","BYD|ETP3 (comercial)":"w:2023_BYD_ETP3.jpg","Cadillac|LYRIQ":"w:2023_Cadillac_Lyriq_in_Satin_Steel_Metallic,_front_left.jpg","Cadillac|OPTIQ":"w:2026_Cadillac_Optiq_700E4.jpg","Cadillac|VISTIQ":"w:2026_Cadillac_Vistiq_Sport_900e4_in_Stellar_Black,_front_left.jpg","Changan|Deepal S05":"w:Deepal_S05_004.jpg","Changan|Deepal S07":"w:2023_Chang'an_Shenlan_S7.jpg","Citroën|ë-C3":"w:Citroën_C3_(4th_generation)_DSC_7103_(retouched).jpg","Citroën|ë-C3 Aircross":"w:Citroën_ë-C3_Aircross_IMG_3525.jpg","Citroën|ë-C4":"w:Citroen_C4_(2020)_1X7A5851.jpg","Citroën|ë-C4 X":"w:Citroen_C4_(2020)_1X7A5851.jpg","Citroën|ë-C5 Aircross":"w:2022_Citroën_C5_Aircross_Automesse_Ludwigsburg_2024_IMG_1342.jpg","Citroën|ë-Berlingo":"w:Citroen_e-Berlingo_Auto_Zuerich_2021_IMG_0097.jpg","Citroën|ë-Jumpy Combi":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Citroën|ë-SpaceTourer":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Citroën|Ami (quadriciclo)":"w:2021_Citroen_Ami.jpg","Citroën|C-Zero":"w:Citroen_C-Zero.JPG","Citroën|ë-Méhari":"w:Citroën_E-Méhari.jpg","Citroën|ë-Berlingo Van (comercial)":"w:Citroen_e-Berlingo_Auto_Zuerich_2021_IMG_0097.jpg","Citroën|ë-Jumpy Van (comercial)":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Citroën|ë-Jumper (comercial)":"w:Fiat_e-Ducato_1X7A0350.jpg","CUPRA|Born":"w:Cupra_Born_–_f_03042026.jpg","CUPRA|Raval":"w:Cupra_Raval_VZ_IMG_6967_(cropped).jpg","CUPRA|Tavascan":"w:Cupra_Tavascan_Endurance_–_f_18042026.jpg","Dacia|Spring":"w:2023_Dacia_Spring_1X7A6327_(2).jpg","Denza|Z9GT":"w:Denza_Z9_GT_MIAS_2026_preview_01.jpg","Dongfeng|Box":"w:Nammi_01_001.jpg","DS Automobiles|DS 3 E-Tense":"w:DS_3_Crossback_PureTech_155_EAT8_So_Chic_–_f_25072020.jpg","DS Automobiles|N°4":"w:DS_4_E-Tense_(2021)_Auto_Zuerich_2021_IMG_0542.jpg","DS Automobiles|N°7":"w:DS_No_7_Auto_Zuerich_2026_IMG_8715.jpg","DS Automobiles|N°8":"w:DS_Automobiles_N°8_AWD_Long_Range_Jules_Verne_–_f_19072025.jpg","DS Automobiles|DS 3 Crossback E-Tense":"w:DS_3_Crossback_PureTech_155_EAT8_So_Chic_–_f_25072020.jpg","Elaris|BEO":"e:Elaris_BEO_2023|1975","Ferrari|Luce":"w:2027_Ferrari_Luce,_front_left.jpg","Fiat|500e":"w:Fiat-500-vorne2.jpg","Fiat|600e":"w:Fiat_600_Hybrid_1.2_T3_Pop_(III)_–_f_24032026.jpg","Fiat|Grande Panda":"w:Fiat_Grande_Panda_Elektro_La_Prima_–_f_01062025.jpg","Fiat|E-Scudo Combi":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Fiat|Topolino (quadriciclo)":"w:2021_Citroen_Ami.jpg","Fiat|E-Doblò":"w:Citroen_e-Berlingo_Auto_Zuerich_2021_IMG_0097.jpg","Fiat|E-Ducato (comercial)":"w:Fiat_e-Ducato_1X7A0350.jpg","Ford|Capri":"w:Ford_Capri_(2024)_Autofrühling_Ulm_2025_DSC_8721.jpg","Ford|Explorer":"w:Ford_Explorer_EV_IMG_2120.jpg","Ford|Mustang Mach-E":"w:2021_Ford_Mustang_Mach-E_Standard_Range_Front.jpg","Ford|Puma Gen-E":"e:Ford_Puma_Gen-E|3597","Ford|e-Tourneo Courier":"w:2024_Ford_Transit_Courier_Limited_-_Cactus_Grey_-_03-02-2024,_Front_Left.jpg","Ford|e-Tourneo Custom":"w:2024_Ford_Transit_Custom_Limited_TDCi_-_1996cc_2.0_(136PS)_Diesel_-_Artisan_Red_-_08-2024,_Front.jpg","Ford|e-Transit Custom Kombi":"w:2024_Ford_Transit_Custom_Limited_TDCi_-_1996cc_2.0_(136PS)_Diesel_-_Artisan_Red_-_08-2024,_Front.jpg","Ford|E-Transit (comercial)":"w:2016_Ford_Transit_350_2.2.jpg","Ford|E-Transit Courier (comercial)":"w:2024_Ford_Transit_Courier_Limited_-_Cactus_Grey_-_03-02-2024,_Front_Left.jpg","Ford|Focus Electric":"w:2012_Ford_Focus_Electric_in_Black,_front_left,_03-20-2025.jpg","GAC|AION UT":"w:Aion_UT_007.jpg","GAC|AION V":"w:GAC_Aion_V_(second_generation)_IAA_2025_DSC_1406.jpg","GAC|AION Y Plus":"w:2021_GAC_Aion_Y_(front).jpg","Geely|E2":"w:2025_Geely_Xingyuan,_front_7.28.25.jpg","Geely|E5":"w:Geely_Galaxy_E5_003_(cropped).jpg","Genesis|G80":"w:Genesis_G80_IAA_2021_1X7A0229.jpg","Genesis|GV60":"w:Genesis_GV60_1X7A5760.jpg","Genesis|GV70":"w:Genesis_GV70_IAA_2021_1X7A0228.jpg","GWM|ORA 07":"w:Ora_Lightning_Cat_004_(cropped).jpg","GWM|ORA 03 (Funky Cat)":"w:GWM_Ora_03_–_f_12102025.jpg","Honda|Super-N":"e:Honda_Super-N_2026|3656","Honda|e":"w:Honda_e_Advance_–_f_18102020.jpg","Honda|e:Ny1":"w:Honda_HR-V_eHEV_Advance_(III)_–_f_31122023.jpg","Hyundai|INSTER":"w:Hyundai_Inster_Prime_–_f_14022026.jpg","Hyundai|IONIQ 3":"w:Hyundai_Ioniq_3_Auto_Zuerich_2026_IMG_8549.jpg","Hyundai|IONIQ 5":"w:Hyundai_Ioniq_5_AWD_Techniq-Paket_–_f_31122024.jpg","Hyundai|IONIQ 6":"w:2023_Hyundai_Ioniq_6_Limited,_front_4.27.23.jpg","Hyundai|IONIQ 9":"w:Hyundai_Ioniq_9_IMG_5950.jpg","Hyundai|Kona Electric":"w:Hyundai_Kona_N_Line_(SX2)_DSC_8250.jpg","Hyundai|STARIA Electric":"w:Hyundai_Staria_1X7A0321.jpg","Hyundai|IONIQ Electric":"w:Hyundai_IONIQ_electric_Premium_–_Frontansicht,_7._Mai_2017,_Düsseldorf.jpg","JAC|E30X":"w:JAC_Yiwei_3_006.jpg","Jaecoo|5 EV":"w:2025_Jaecoo_5_1.6_Luxury_(United_Kingdom)_front_view.jpg","Jaguar|I-PACE":"w:2018_Jaguar_I-Pace_EV400_AWD_Front.jpg","Jeep|Avenger":"w:Jeep_Avenger_Elektro_Summit_–_f_18052025.jpg","Jeep|Compass Electric":"e:Jeep_Compass_2025|3684","KGM|Torres EVX":"w:KGM_Torres_Hybrid_Automesse_Ludwigsburg_2025_DSC_2567.jpg","KGM|Korando e-Motion":"w:Ssangyong_Korando_(4th_generation)_IMG_3084.jpg","Kia|EV2":"w:Kia_EV2_IMG_8443.jpg","Kia|EV3":"w:Kia_EV3_GT-Line_Automesse_Ludwigsburg_2025_DSC_2635_(cropped).jpg","Kia|EV4":"w:Kia_EV4_GT-Line_Automesse_Ludwigsburg_2025_DSC_2535.jpg","Kia|EV5":"w:2024_Kia_EV5_Earth_Exclusive_AWD_(Thailand)_front_view.png","Kia|EV6":"w:2021_Kia_EV6_GT-Line_S.jpg","Kia|EV9":"w:Kia_EV9_1X7A2472.jpg","Kia|PV5 Passenger":"w:Kia_PV5_(SW1)_Cargo_–_Seoul_Mobility_Show_2025_(07).jpg","Kia|e-Niro / Niro EV":"w:Kia_Niro_(SG2)_PHEV_Leonberg_2022_1X7A0474.jpg","Kia|e-Soul":"w:2020_Kia_Soul_First_Edition_EV_Front.jpg","Kia|Soul EV":"w:2020_Kia_Soul_First_Edition_EV_Front.jpg","Lancia|Gamma":"w:2026_Lancia_Gamma_EV_front.jpg","Lancia|Ypsilon":"w:2024_Lancia_Ypsilon_Cassina_BEV.jpg","Land Rover|Range Rover":"w:2022_Land_Rover_Range_Rover_SE_P440e_AWD_Automatic_3.0_Front.jpg","Land Rover|Range Rover Sport":"e:Land_Rover_Range_Rover_Sport_2027|3815","Leapmotor|B03X":"w:Leapmotor_B03X_Leonberg_2026_IMG_8589.jpg","Leapmotor|B05":"w:Leapmotor_Lafa_5_003.jpg","Leapmotor|B10":"w:Leapmotor_B10_Design_Pro_Max_–_f_25012026.jpg","Leapmotor|C10":"w:Leapmotor_C10_EREV_Classic-Gala_2025_DSC_0779.jpg","Leapmotor|T03":"w:2020_Leapmotor_T03_(front).jpg","Lexus|ES":"e:Lexus_ES_2026|3493","Lexus|RZ":"w:Lexus_RZ_300e_(XEBM10)_IMG_6622.jpg","Lexus|TZ":"w:Lexus_TZ550e_AWD.jpg","Lexus|UX 300e":"w:Lexus_UX_250h_IMG_2810.jpg","Lotus|Eletre":"w:Lotus_Eletre_Automesse_Ludwigsburg_2025_DSC_2658.jpg","Lotus|Emeya":"w:Lotus_Emeya_IMG_4142.jpg","Lucid|Air":"w:2022_Lucid_Air_Grand_Touring_in_Zenith_Red,_front_left.jpg","Lucid|Gravity":"w:Lucid_Gravity_Grand_Touring_GIMS_2024_1X7A2334.jpg","Lynk&Co|02":"w:Lynk_&_Co_02.jpg","Maserati|GranTurismo Folgore":"w:Maserati_GranTurismo_Trofeo_1X7A0828.jpg","Maserati|GranCabrio Folgore":"w:Maserati_GranTurismo_Trofeo_1X7A0828.jpg","Maserati|Grecale Folgore":"w:Maserati_Grecale_GT_1X7A6371.jpg","Maxus|MIFA 7":"w:Maxus_G70_003.jpg","Maxus|MIFA 9":"w:2024_LDV_MIFA_Executive_front.jpg","Maxus|eDeliver 3 (comercial)":"w:Maxus_eDeliver_3_1X7A0873.jpg","Maxus|eDeliver 5 (comercial)":"w:Maxus_eDeliver_5_IAA_Transportation_2024_(DSC02696).jpg","Maxus|eDeliver 7 (comercial)":"w:(SGP-Singapore)_Private_Maxus_eDeliver_7_GBT3557M_2024-11-06.jpg","Maxus|eDeliver 9 (comercial)":"w:Maxus_Deliver_9_1X7A0341.jpg","Maxus|eT90 (pick-up)":"w:Maxus_T90_EV_1X7A2511.jpg","Mazda|6e":"w:Mazda6e_IMG_6681.jpg","Mazda|CX-6e":"w:Mazda_EZ-60_EREV_China_2026-03-16.jpg","Mazda|MX-30":"w:2021_Mazda_MX-30_Front.jpg","Mercedes-Benz|CLA":"w:Mercedes-Benz_C118_IMG_2673.jpg","Mercedes-Benz|CLA Shooting Brake":"w:Mercedes-Benz_C118_IMG_2673.jpg","Mercedes-Benz|Classe C":"w:Mercedes-Benz_W206_IMG_6380.jpg","Mercedes-Benz|GLA":"e:Mercedes_GLA_2027|3685","Mercedes-Benz|GLB":"e:Mercedes_GLB|3788","Mercedes-Benz|GLC":"w:Mercedes-Benz_X254_1X7A6343.jpg","Mercedes-Benz|EQS":"w:Mercedes-Benz_V297_Classic-Days_2022_DSC_0016.jpg","Mercedes-Benz|Classe G":"e:Mercedes_G-Class|2192","Mercedes-Benz|AMG GT":"w:Mercedes-Benz_AMG_GT_63S_(51750035016)_(cropped).jpg","Mercedes-Benz|VLE":"w:Mercedes-Benz_VLE_-_Avant.jpg","Mercedes-Benz|eVito Tourer":"w:Mercedes-Benz_V_250_d_Exclusive_AMG_Line_Lang_(V_447)_–_Frontansicht,_29._Juni_2016,_Düsseldorf.jpg","Mercedes-Benz|EQA":"w:Mercedes-Benz_H243_IMG_5876.jpg","Mercedes-Benz|EQB":"w:Mercedes-Benz_X243_300_1X7A0422.jpg","Mercedes-Benz|EQC":"w:Mercedes-Benz_EQC_400_4MATIC_AMG_Line_(N_293)_–_f_02042021.jpg","Mercedes-Benz|EQE / EQE SUV":"w:Mercedes-Benz_V295_350+_Classic-Days_2022_DSC_0018.jpg","Mercedes-Benz|EQS SUV":"w:Mercedes-Benz_X296_1X7A1725.jpg","Mercedes-Benz|B 250 e":"w:Mercedes-Benz_B_200_CDI_Sport-Paket_(W_246)_–_Frontansicht,_21._April_2014,_Düsseldorf.jpg","Mercedes-Benz|EQV":"w:Mercedes-Benz_V_250_d_Exclusive_AMG_Line_Lang_(V_447)_–_Frontansicht,_29._Juni_2016,_Düsseldorf.jpg","Mercedes-Benz|EQT":"w:Mercedes-Benz_W420_1X7A0314.jpg","Mercedes-Benz|eCitan (comercial)":"w:Mercedes-Benz_W420_1X7A0314.jpg","Mercedes-Benz|eVito Van (comercial)":"w:Mercedes-Benz_V_250_d_Exclusive_AMG_Line_Lang_(V_447)_–_Frontansicht,_29._Juni_2016,_Düsseldorf.jpg","Mercedes-Benz|eSprinter (comercial)":"w:2019_Mercedes-Benz_Sprinter_314_CDi_2.1.jpg","MG|MG4":"w:MG4_Electric_–_f_21042025.jpg","MG|MGS5 EV":"w:MGS5_EV_Automesse_Ludwigsburg_2025_DSC_2557.jpg","MG|IM5":"w:IM_L6_GIMS_2024_1X7A2393.jpg","MG|IM6":"w:IM_LS6_008.jpg","MG|Cyberster":"w:MG_Cyberster_XPower_–_f1_01112026.jpg","MG|ZS EV":"w:MG_ZS_(crossover,_second_generation)_DSC_8542.jpg","MG|MG5":"w:Roewe_Ei5_facelift_001.jpg","MG|Marvel R":"w:Roewe_Marvel_X_IMG002_(cropped).jpg","Mini|Cooper":"w:Mini_Hatch_(J01)_Ditzingen_Mobil_IMG_9772_(cropped).jpg","Mini|Aceman":"w:Mini_Aceman_DSC_7114.jpg","Mini|Countryman":"e:Mini_Countryman_2024|3456","Mitsubishi|Eclipse Cross":"w:Mitsubishi_Eclipse_Cross_(second_generation)_Auto_Zuerich_2025_DSC_3303.jpg","Mitsubishi|i-MiEV":"w:2010_Mitsubishi_i-MiEV_(GA_MY10)_hatchback_(2015-11-11)_01.jpg","Nissan|Ariya":"w:2023_Nissan_Ariya_Advance_Front.jpg","Nissan|LEAF":"w:Nissan_Leaf_(ZE2)_autoMOBIL_Tübingen_2025_DSC_2752.jpg","Nissan|Micra":"e:Nissan_Micra_2025|3202","Nissan|Pixo":"e:Nissan_Pixo_2027|3784","Nissan|Townstar EV":"w:2024_Renault_Kangoo_in_Mineral_White,_front_left,_06-12-2025.jpg","Nissan|e-NV200":"w:2021_Nissan_NV200_Vanette.jpg","Nissan|Interstar-e (comercial)":"w:2025_Renault_Master_in_Urban_Grey,_front_right,_06-12-2025.jpg","Omoda|E5":"w:2023_Omoda_C5_front_view.png","Opel|Astra Electric":"w:Opel_Astra_1.2_Turbo_Ultimate_(L)_–_f_13122024.jpg","Opel|Combo Electric":"w:2018_Opel_Combo_life_front_quarter_right_Ruesselsheim_LWEOS1809_(cropped).jpg","Opel|Corsa Electric":"w:Opel_Corsa-e_at_IAA_2019_IMG_0738.jpg","Opel|Frontera Electric":"w:Opel_Frontera_1.2_DIT_Hybrid_Ultimate_(C)_–_f_03042026.jpg","Opel|Grandland Electric":"w:Opel_Grandland_Hybrid4_Automesse_Ludwigsburg_2022_1X7A5911.jpg","Opel|Mokka Electric":"w:Opel_Mokka-e_IMG_6111.jpg","Opel|Vivaro Combi Electric":"w:Opel_Vivaro_Combi_Facelift_front.JPG","Opel|Zafira Electric":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Opel|Ampera-e":"w:2022_Chevrolet_Bolt_EV_2LT,_NYC_official_fleet_1.2.23.jpg","Opel|Rocks Electric (quadriciclo)":"w:2021_Citroen_Ami.jpg","Opel|Vivaro Electric (comercial)":"w:Opel_Vivaro_Combi_Facelift_front.JPG","Opel|Movano Electric (comercial)":"w:Fiat_e-Ducato_1X7A0350.jpg","Peugeot|e-208":"w:Peugeot_e-208_facelift_1X7A2502.jpg","Peugeot|e-2008":"w:2023_Peugeot_2008_in_Vertigo_Blue,_front_left,_06-08-2025.jpg","Peugeot|e-308":"w:2022_-_Peugeot_308_III_(C)_-_196.jpg","Peugeot|e-3008":"w:Peugeot_e-3008_Automesse_Ludwigsburg_2024_IMG_1537.jpg","Peugeot|e-408":"w:Peugeot_408_Hybrid_136_e-DSC6_Allure_–_f_09022025.jpg","Peugeot|e-5008":"w:Peugeot_5008_C_DSC_2949.jpg","Peugeot|e-Rifter":"w:Citroën_Berlingo_XL_BlueHDi_130_EAT8_Shine_XTR_(III)_–_f_02012021.jpg","Peugeot|e-Expert Combi":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Peugeot|e-Traveller":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Peugeot|iOn":"w:2010_Mitsubishi_i-MiEV_(GA_MY10)_hatchback_(2015-11-11)_01.jpg","Peugeot|e-Partner (comercial)":"w:Citroën_Berlingo_XL_BlueHDi_130_EAT8_Shine_XTR_(III)_–_f_02012021.jpg","Peugeot|e-Expert Van (comercial)":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Peugeot|e-Boxer (comercial)":"w:Fiat_e-Ducato_1X7A0350.jpg","Polestar|2":"w:Polestar_2_–_f_02042021.jpg","Polestar|3":"w:Polestar_3_Auto_Zuerich_2023_1X7A1307.jpg","Polestar|4":"w:Polestar_4_DSC_8232_(cropped_2).jpg","Polestar|5":"w:Polestar_5_Auto_Zuerich_2025_DSC_3198.jpg","Porsche|Cayenne Electric":"w:Porsche_Cayenne_Electric_IMG_8181.jpg","Porsche|Macan Electric":"w:Porsche_Macan_Turbo_(XAB)_IMG_1762.jpg","Porsche|Taycan":"w:2020_Porsche_Taycan_4S_79kWh_Front.jpg","Porsche|Taycan Sport Turismo":"w:2020_Porsche_Taycan_4S_79kWh_Front.jpg","Porsche|Taycan Cross Turismo":"w:2020_Porsche_Taycan_4S_79kWh_Front.jpg","Renault|4 E-Tech":"w:Renault_4_E-Tech_150_Comfort_Range_Techno_–_f_22062025.jpg","Renault|5 E-Tech":"w:Renault_5_E-Tech_Electric_DSC_7279.jpg","Renault|Megane E-Tech":"w:Renault_Mégane_E-Tech_IMG_4064.jpg","Renault|Scenic E-Tech":"w:Renault_Scénic_E-Tech_IMG_9977.jpg","Renault|Twingo E-Tech":"w:Renault_Twingo_E-Tech_IMG_6605.jpg","Renault|Kangoo E-Tech":"w:2024_Renault_Kangoo_in_Mineral_White,_front_left,_06-12-2025.jpg","Renault|ZOE":"w:Renault_Zoe_R110_Z.E._50_Experience_(Facelift)_–_f_22112020.jpg","Renault|Twizy (quadriciclo)":"w:Eng_Renault_Twizy_ZE.jpg","Renault|Fluence Z.E.":"w:Renault_Fluence_Z.E._–_Frontansicht,_25._Februar_2012,_Düsseldorf.jpg","Renault|Kangoo Z.E.":"w:2024_Renault_Kangoo_in_Mineral_White,_front_left,_06-12-2025.jpg","Renault|Trafic E-Tech (comercial)":"w:2024_Renault_Trafic_LWB_Premium_front.jpg","Renault|Master E-Tech (comercial)":"w:2025_Renault_Master_in_Urban_Grey,_front_right,_06-12-2025.jpg","Rolls-Royce|Spectre":"w:2024_Rolls-Royce_Spectre_in_Midnight_Sapphire_over_Silver,_front_left.jpg","Škoda|Elroq":"w:Škoda_Elroq_DSC_9260.jpg","Škoda|Enyaq":"w:Škoda_Enyaq_IMG_1190.jpg","Škoda|Enyaq Coupe":"w:Škoda_Enyaq_IMG_1190.jpg","Škoda|Epiq":"w:Škoda_Epiq_Auto_Zuerich_2026_IMG_8960.jpg","Škoda|Peaq":"w:Škoda_Peaq_Sindelfingen_2026_IMG_8235.jpg","Škoda|Citigo e iV":"w:2013_Volkswagen_Take_UP!_1.0.jpg","Smart|1":"w:Smart_♯1_Pro_–_f_11102025.jpg","Smart|2":"w:Smart_♯2_Premium_–_f_08112026.jpg","Smart|3":"w:Smart_Hashtag_3_DSC_7992.jpg","Smart|5":"w:Smart_Hashtag_5_Premium_autoMOBIL_Tübingen_2025_DSC_2755_(cropped).jpg","Smart|EQ fortwo / forfour":"w:2016_Smart_Fortwo_Passion_Automatic_1.0_Front.jpg","Smart|fortwo electric drive":"w:2016_Smart_Fortwo_Passion_Automatic_1.0_Front.jpg","Subaru|E-Outback":"e:Subaru_E-Outback_2026|3506","Subaru|Solterra":"w:Subaru_Solterra_1X7A1840.jpg","Subaru|Uncharted":"w:Subaru_Uncharted_IMG_6871.jpg","Suzuki|e VITARA":"w:Suzuki_e_Vitara_in_Hamamatsu_Sta_front.jpg","Tesla|Model 3":"w:Tesla_Model_3_(2023)_Autofrühling_Ulm_IMG_9282.jpg","Tesla|Model Y":"w:Tesla_Model_Y_Premium_(Facelift)_–_f_05052026.jpg","Tesla|Model S":"w:Tesla_Model_S_(Facelift_ab_04-2016)_(cropped).jpg","Tesla|Model X":"w:2017_Tesla_Model_X_100D_Front.jpg","Toyota|bZ4X":"w:Toyota_bZ4X_Automesse_Ludwigsburg_2022_1X7A5895.jpg","Toyota|C-HR+":"w:Toyota_C-HR+_Teamplayer_–_f_05042026.jpg","Toyota|Urban Cruiser":"e:Toyota_Urban_Cruiser|3208","Toyota|Proace City Verso":"w:Citroën_Berlingo_XL_BlueHDi_130_EAT8_Shine_XTR_(III)_–_f_02012021.jpg","Toyota|Proace Verso":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Toyota|Proace City Electric (comercial)":"w:Citroën_Berlingo_XL_BlueHDi_130_EAT8_Shine_XTR_(III)_–_f_02012021.jpg","Toyota|Proace Electric (comercial)":"w:2016_Citroen_Dispatch_1000_BlueHDi_X_S_1.6_Front.jpg","Toyota|Proace Max Electric (comercial)":"w:Fiat_e-Ducato_1X7A0350.jpg","Volkswagen|ID.3":"w:2020_Volkswagen_ID.3_1st_Front.jpg","Volkswagen|ID.4":"w:2025_Volkswagen_ID4_Pro_Redspot_front.jpg","Volkswagen|ID.5":"w:Volkswagen_ID.5_Leonberg_2022_1X7A0459.jpg","Volkswagen|ID.7":"w:Volkswagen_ID.7_DSC_7879_(cropped).jpg","Volkswagen|ID.7 Tourer":"w:Volkswagen_ID.7_DSC_7879_(cropped).jpg","Volkswagen|ID. Polo":"w:Volkswagen_ID.Polo_IMG_8361.jpg","Volkswagen|ID. Cross":"w:Volkswagen_ID._Cross_Auto_Zuerich_2026_IMG_8599.jpg","Volkswagen|ID. Tiguan":"w:Volkswagen_ID.Tiguan_Auto_Zuerich_2026_IMG_8986.jpg","Volkswagen|ID. Buzz":"w:Volkswagen_ID._Buzz_1X7A6263.jpg","Volkswagen|e-Transporter Kombi":"w:Volkswagen_T7_Transporter_DSC_9339.jpg","Volkswagen|e-Caravelle":"w:Volkswagen_T7_Transporter_DSC_9339.jpg","Volkswagen|e-Golf":"w:2013_Volkswagen_Golf_SE_BlueMotion_Technology_1.4_Front.jpg","Volkswagen|e-up!":"w:2013_Volkswagen_Take_UP!_1.0.jpg","Volkswagen|ID. Buzz Cargo (comercial)":"w:Volkswagen_ID._Buzz_1X7A6263.jpg","Volkswagen|e-Crafter (comercial)":"w:2017_Volkswagen_Crafter_CR35_Trendline_TD_2.0_Front.jpg","Volvo|EX30":"w:Volvo_EX30_IMG_8923.jpg","Volvo|EX40 (antigo XC40 Recharge)":"w:2019_Volvo_XC40_T5_Momentum_in_Bright_Silver_Metallic,_front_left,_2025-09-22.jpg","Volvo|EC40 (antigo C40 Recharge)":"w:Volvo_C40_DSC_7985.jpg","Volvo|EX60":"w:Volvo_EX60_Auto_Zuerich_2026_IMG_9058.jpg","Volvo|EX90":"w:Volvo_EX90_autoMOBIL_Tübingen_2025_DSC_2740.jpg","Volvo|ES90":"w:Volvo_ES90_Ultra_–_f_29032026.jpg","Voyah|Courage":"w:Voyah_Courage_005.jpg","Voyah|Dream":"w:2021_Voyah_Dreamer_(front).jpg","Voyah|Free":"w:(CHN-Shanghai)_Showcar_Voyah_Free+_No-plate_2025-12-21.jpg","XPENG|G6":"w:XPeng_G6_018_(cropped).jpg","XPENG|G9":"w:2022_XPeng_G9_(front).jpg","XPENG|G9L":"w:XPeng_G9_Performance_IMG_9722.jpg","XPENG|L03":"w:(CHN-Hubei)_Showcar_XPeng_Mona_M03_No-plate_2024-12-03.jpg","XPENG|P7+":"w:XPeng_P7+_IAA_2025_DSC_2059_(cropped).jpg","XPENG|X9":"w:XPeng_X9_003_(cropped).jpg","XPENG|P7":"w:XPeng_P7_II_MY2025_IMG03.jpg","XPENG|G3":"w:Xpeng_G3i_001.jpg","Zeekr|001":"w:2022_Zeekr_001_(front).jpg","Zeekr|7GT":"w:Zeekr_007_006_(cropped).jpg","Zeekr|7X":"w:Zeekr_7X_005_(cropped).jpg","Zeekr|X":"w:2023_Zeekr_X_(front).jpg","Aiways|U5":"w:Aiways_U5_IMG_4448.jpg","Aiways|U6":"w:Aiways_U6_Auto_Zuerich_2023_1X7A1153.jpg","e.GO Mobile|Life":"w:E.Go_Life_Genf_2019_1Y7A5161.jpg","Fisker|Ocean":"w:Fisker_Ocean_Motorworld_Munich_1X7A0079.jpg","Forthing|Friday":"w:Forthing_Friday_EV_IAA_2023_1X7A0251.jpg","Hongqi|E-HS9":"w:Hongqi_E-HS9_IMG_0753_(cropped).jpg","Hongqi|EH7":"w:Hongqi_EH7_01_China_2025-03-31.jpg","Hongqi|EHS7":"w:Hongqi_Tiangong_08_001.jpg","Seres|3":"w:Dongfeng_Fengon_500_Shishi_01_2022-11-04.jpg","Seres|5":"w:Seres_SF5_004.jpg","Skywell|ET5":"w:2022_Skyworth_EV6_(front).jpg","Farizon|SuperVAN (comercial)":"w:Farizon_SV_004.jpg","SEAT|Mii electric":"w:2013_Volkswagen_Take_UP!_1.0.jpg","Iveco|eDaily (comercial)":"w:2014_Iveco_Daily_35_S13_MWB_2.3.jpg","Microlino|Microlino (quadriciclo)":"w:Micro_Microlino_Pioneer_Series_Rasant_Automobilmesse_Metzingen_2024_IMG_2235.jpg","Silence|S04 Nanocar (quadriciclo)":"w:Silence_S04_Automesse_Ludwigsburg_2024_IMG_1677.jpg","Mobilize|Duo (quadriciclo)":"w:Mobilize_Duo_Auto_Zuerich_2024_DSC_6426.jpg","Mobilize|Bento (quadriciclo comercial)":"w:Mobilize_Duo_Auto_Zuerich_2024_DSC_6426.jpg","Aixam|e-City / e-Coupé (quadriciclo)":"w:City_premium_voiture_sans_permis_aixam_pour_Wikipedia_(cropped).jpg","Ligier|Myli (quadriciclo)":"w:Ligier_Myli_2023_front.jpg","XEV|YoYo (quadriciclo)":"w:XEV_Yoyo_IAA_2021_1X7A0240.jpg","Bolloré|Bluecar":"w:Paris_Autolib_06_2012_Bluecar_2907.JPG","Cenntro|Logistar (comercial)":"w:Cenntro_Logistar,_Nagymező_Straße,_2024_Terézváros.jpg","Estrima|Birò (quadriciclo)":"w:Matteo_Maestri_e_Birò.jpg","Goupil|G4 (comercial)":"w:Goupil_G4_IAA_Transportation_2026_(DSC7713).jpg","Goupil|G6 (comercial)":"w:Goupil_G6.jpg","Tazzari|Zero":"w:Girona_048.JPG","Think|City":"w:Think_City_2007.jpg"};
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
.gm .dev{--hlc:var(--acct);--hlbg:var(--pill);--px:12px;font-family:var(--ff);text-align:left;margin:0 auto;-webkit-font-smoothing:antialiased}
.gm .dev *{box-sizing:border-box}
.gm .dev svg{flex:none}
.gm .dev.phone{width:272px;max-width:100%;background:#0A0A0A;border-radius:42px;padding:8px;box-shadow:0 18px 40px rgba(23,20,36,.22)}
.gm .dev .scr{position:relative;background:var(--bg);color:var(--fg);border-radius:34px;overflow:hidden;height:540px;display:flex;flex-direction:column;font-size:12.5px;line-height:1.3}
.gm .m-top{flex:none;color:var(--fg)}
.gm .band .m-top{background:var(--hd);color:var(--hdfg)}
.gm .m-sb{display:flex;justify-content:space-between;align-items:center;height:34px;padding:0 20px 0 26px;font:600 11px/1 var(--ff)}
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
.gm .dev .hl{outline:2px solid var(--hlc);outline-offset:-2px;background-image:linear-gradient(var(--hlbg),var(--hlbg))}
.gm .l-flat .m-row.hl{border-radius:6px}
.gm .dev.spot .m-grp>:not(.hl),.gm .dev.spot .m-pair>:not(.hl),.gm .dev.spot .m-tl>:not(.hl){opacity:.42}
.gm .m-sw{flex:none;position:relative;width:38px;height:23px;border-radius:999px;background:var(--line)}
.gm .m-sw i{position:absolute;top:2px;left:2px;width:19px;height:19px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.3)}
.gm .m-sw.on{background:var(--swc,var(--acc))}
.gm .m-sw.on i{left:17px;background:var(--on)}
.gm .sw-ios .m-sw.on i{background:#fff}
.gm .sw-ios.sk-mini .m-sw.on i,.gm .sw-ios.sk-smart .m-sw.on i{background:#000}
.gm .sw-md .m-sw{width:40px;height:24px;background:transparent;border:2px solid var(--mut)}
.gm .sw-md .m-sw i{top:4px;left:4px;width:12px;height:12px;background:var(--mut);box-shadow:none}
.gm .sw-md .m-sw.on{background:var(--swc,var(--acc));border-color:var(--swc,var(--acc))}
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
.gm .m-toast{flex:none;display:flex;align-items:center;gap:9px;margin:0 var(--px) 10px;padding:10px 12px;border-radius:12px;background:#24222B;color:#fff;font-size:11.5px;font-weight:600;line-height:1.3;box-shadow:0 6px 16px rgba(0,0,0,.22)}
.gm .dark .m-toast{background:#F4F4F6;color:#141218}
.gm .m-toast.end{margin-bottom:24px}
.gm .m-tic{flex:none;width:22px;height:22px;border-radius:50%;background:#40DDA6;color:#0B3D2C;display:flex;align-items:center;justify-content:center}
.gm .m-tic svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.6}
.gm .m-btn.hl{outline:3px solid var(--hlc);outline-offset:2px;background-image:none}
.gm .bt-full .m-btn.hl{outline-offset:-3px}
.gm .m-sheet{position:absolute;inset:0;z-index:5;background:rgba(10,10,14,.42);display:flex;align-items:flex-end}
.gm .m-sh{width:100%;background:var(--card);color:var(--fg);border-radius:18px 18px 0 0;padding:8px 16px 26px;display:flex;flex-direction:column;align-items:center;gap:8px}
.gm .light .m-sh{background:#fff}
.gm .m-grab{width:36px;height:4px;border-radius:2px;background:var(--line)}
.gm .m-sht{font-size:13px;font-weight:700;align-self:stretch;text-align:center}
.gm .m-wheel{position:relative;align-self:stretch;display:flex;flex-direction:column;align-items:center;font-variant-numeric:tabular-nums}
.gm .m-wheel span{height:26px;line-height:26px;font-size:15px;color:var(--mut);opacity:.6}
.gm .m-wheel span:first-child,.gm .m-wheel span:last-child{opacity:.3;font-size:13px}
.gm .m-wheel .on{align-self:stretch;text-align:center;font-size:19px;font-weight:700;color:var(--fg);opacity:1;border-radius:10px;outline:2px solid var(--hlc);outline-offset:-2px;background:var(--hlbg)}
.gm .m-shb{align-self:stretch;margin-top:4px;padding:11px;text-align:center;border-radius:var(--br);background:var(--acc);color:var(--on);font-weight:700;font-size:13px}
.gm .has-sheet .m-hi{z-index:6}
.gm .dark .m-warn{color:#FFD27A}
.gm .m-warn svg{width:15px;height:15px;margin-top:1px}
.gm .m-hi{position:absolute;bottom:7px;left:50%;width:92px;height:4px;margin-left:-46px;border-radius:2px;background:var(--fg);opacity:.85}
.gm .bt-full.has-btn .m-hi{background:var(--on)}
.gm .is-home:not(.has-tabs) .m-body{padding-bottom:26px}
.gm .dev .scr{height:540px}
.gm .m-act{position:absolute;right:10px;top:2px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px}
.gm .m-act svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.7}
.gm .m-tabs>span.hl{border-radius:10px}
.gm .xb-img,.gm .xd-img,.gm .xc-img,.gm .xf-img,.gm .xo-img,.gm .xj-img,.gm .bc-car{display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}
.gm .xb-img img,.gm .xd-img img,.gm .xc-img img,.gm .xf-img img,.gm .xo-img img,.gm .xj-img img,.gm .bc-car img{display:block;width:100%;height:100%;object-fit:cover}
.gm .xb-img>svg,.gm .xd-img>svg,.gm .xc-img>svg,.gm .xf-img>svg,.gm .xo-img>svg,.gm .xj-img>svg,.gm .bc-car>svg{width:150px;color:currentColor;opacity:.55}
.gm .xb-c svg,.gm .xb-q svg,.gm .xb-st svg,.gm .xd svg,.gm .xc svg,.gm .xf svg,.gm .xf-body svg,.gm .xo svg,.gm .xj svg,.gm .m-act svg{stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.gm .sk-byd.is-home .scr{background:linear-gradient(180deg,#DCE6F0 0,#B9CADF 20%,#86A1C2 38%,#E6ECF3 56%,#EEF2F7 100%)}
.gm .sk-byd.is-home .m-body{padding-top:2px}
.gm .xb{display:flex;flex-direction:column;gap:6px}
.gm .xb-nm{display:flex;align-items:flex-end;gap:5px;font-size:19px;font-weight:600;letter-spacing:.01em;padding:0 4px}
.gm .xb-nm .xb-tri{width:7px;height:7px;fill:#6B7486;stroke:none;margin-bottom:5px}
.gm .xb-rg{padding:0 4px}
.gm .xb-rg b{font-size:22px;font-weight:400;letter-spacing:-.01em}
.gm .xb-rg span{display:block;width:84px;height:2px;background:rgba(27,31,42,.15);margin-top:3px}
.gm .xb-rg i{display:block;height:100%;background:#1B1F2A}
.gm .xb-st{display:flex;align-items:center;gap:6px;font-size:10.5px;padding:0 4px}
.gm .xb-st em{width:1px;height:10px;background:rgba(27,31,42,.25)}
.gm .xb-st span{color:#4F6585}
.gm .xb-st svg{width:11px;height:11px;color:#4F6585}
.gm .xb-img{height:104px;border-radius:14px;color:#3F4A5E}
.gm .xb-q{display:flex;justify-content:space-around;margin:2px 0}
.gm .xb-q i{width:44px;height:44px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(30,50,90,.08)}
.gm .xb-q svg{width:19px;height:19px;color:#1B1F2A}
.gm .xb-cards{display:flex;flex-wrap:wrap;gap:8px}
.gm .xb-c{position:relative;width:calc(50% - 4px);min-width:0;background:#fff;border-radius:16px;padding:10px;display:flex;align-items:center;gap:8px;min-height:54px;font-size:11px}
.gm .xb-c b{display:block;font-weight:600;font-size:11.5px;line-height:1.2}
.gm .xb-c small{display:block;color:#7A8394;font-size:10.5px;margin-top:2px}
.gm .xb-c>svg{width:20px;height:20px;color:#1B1F2A}
.gm .xb-ac{justify-content:space-between}
.gm .xb-ac span{width:24px;height:24px;border:1px solid #E3E7EE;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;line-height:1}
.gm .xb-ac b{font-size:18px}
.gm .xb-w{width:100%}
.gm .xb-w>div{flex:1;min-width:0}
.gm .xb-w>svg:first-child{color:#23A455}
.gm .xb-w .xb-ch{width:16px;height:16px;color:#7A8394}
.gm .sk-byd .m-tabs{background:#fff;border-top:0;padding-top:6px}
.gm .sk-byd .m-tabs>span{font-size:10.5px}
.gm .sk-byd .m-tabs>span.on{color:#1B1F2A}
.gm .sk-denza.is-home .scr{background:linear-gradient(180deg,#6B7C98 0%,#8D93A6 20%,#C9A182 34%,#55607E 50%,#1E2740 70%,#121829 100%)}
.gm .sk-denza:not(.is-home) .scr{background:linear-gradient(180deg,#2A3655 0,#151C30 45%)}
.gm .xd{display:flex;flex-direction:column;gap:6px}
.gm .xd-hd{display:flex;align-items:center;gap:7px;padding:0 2px}
.gm .xd-hd b{font-size:15px;font-weight:700;letter-spacing:.05em;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.gm .xd .xd-tri{flex:none;width:7px;height:9px;fill:#fff;stroke:none}
.gm .xd-bt{flex:none;margin-left:auto;display:flex;align-items:center;background:rgba(255,255,255,.2);border-radius:5px;padding:3px 4px}
.gm .xd-bt svg{width:12px;height:12px}
.gm .xd-st{display:flex;align-items:center;gap:6px;font-size:10.5px;padding:0 2px}
.gm .xd-st em{width:1px;height:10px;background:rgba(255,255,255,.45)}
.gm .xd-st span{color:rgba(255,255,255,.75)}
.gm .xd-rg{display:flex;align-items:flex-end;gap:10px;padding:0 2px;margin-top:4px}
.gm .xd-rg>b{font-family:var(--hf);font-size:56px;font-weight:300;line-height:.9;letter-spacing:-.03em;color:rgba(255,255,255,.9)}
.gm .xd-rg>div{display:flex;flex-direction:column;gap:3px;padding-bottom:2px}
.gm .xd-rg span{display:flex;align-items:center;gap:4px;font-size:13px}
.gm .xd-rg span svg{width:14px;height:14px}
.gm .xd-rg i{display:block;width:70px;height:4px;border-radius:2px;background:rgba(255,255,255,.35)}
.gm .xd-rg i em{display:block;height:100%;border-radius:2px;background:#3DDC6A}
.gm .xd-rg small{font-size:18px}
.gm .xd-img{height:88px;border-radius:14px;color:#fff}
.gm .xd-q{display:flex;gap:8px}
.gm .xd-q i{flex:1;height:42px;border-radius:14px;background:rgba(255,255,255,.13);display:flex;align-items:center;justify-content:center}
.gm .xd-q svg{width:20px;height:20px}
.gm .xd-dots{display:flex;justify-content:center;gap:4px}
.gm .xd-dots i{width:6px;height:3px;border-radius:2px;background:rgba(255,255,255,.35)}
.gm .xd-dots i.on{width:14px;background:#fff}
.gm .xd-c{position:relative;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.1);border-radius:14px;padding:10px 12px}
.gm .xd-c>div{flex:1;min-width:0}
.gm .xd-c b{display:block;font-size:12.5px;font-weight:600}
.gm .xd-c small{display:block;font-size:10.5px;color:rgba(255,255,255,.7);margin-top:2px}
.gm .xd-c>svg{width:18px;height:18px}
.gm .xd-c>svg:last-child{width:15px;height:15px;opacity:.7}
.gm .sk-cupra .scr{background:linear-gradient(180deg,#2A2C33 0,#1E1F24 40%)}
.gm .sk-cupra.is-home .scr{background:radial-gradient(110% 55% at 0% 32%,rgba(194,124,78,.3),transparent 62%),linear-gradient(180deg,#2B2D34,#1E1F24 60%)}
.gm .xc{display:flex;flex-direction:column;gap:6px}
.gm .xc-top{position:relative;display:flex;justify-content:center;align-items:center;height:30px}
.gm .xc-pill{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.09);border-radius:999px;padding:6px 12px;max-width:180px}
.gm .xc-pill b{flex:none;max-width:140px;font-size:12px;font-weight:500;letter-spacing:.07em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gm .xc-pill svg{width:15px;height:15px}
.gm .xc-pill .xc-dn{transform:rotate(90deg);width:12px;height:12px}
.gm .xc-bell{position:absolute;right:2px;top:6px}
.gm .xc-bell svg{width:18px;height:18px}
.gm .xc-bell i{position:absolute;top:0;right:0;width:6px;height:6px;border-radius:50%;background:#C27C4E}
.gm .xc-up{display:flex;justify-content:center;align-items:center;gap:4px;font-size:9.5px;color:#A4A7AE}
.gm .xc-up svg{width:10px;height:10px}
.gm .xc-km{display:flex;justify-content:center;align-items:baseline;gap:3px}
.gm .xc-km svg{width:13px;height:13px;align-self:center;transform:rotate(-90deg)}
.gm .xc-km b{font-size:21px;font-weight:400}
.gm .xc-km small{font-size:11px}
.gm .xc-img{height:88px;border-radius:12px;color:#fff}
.gm .xc-ctl{display:flex;gap:6px;margin-top:2px}
.gm .xc-ctl i{position:relative;flex:1;min-width:0;height:34px;display:flex;align-items:center;justify-content:center;border:1px solid #4A4D56;border-radius:8px;background:rgba(255,255,255,.04)}
.gm .xc-ctl .xc-l{border-radius:8px 0 0 8px;margin-right:-6px;background:rgba(255,255,255,.13)}
.gm .xc-ctl .xc-r{border-radius:0 8px 8px 0;border-left:0}
.gm .xc-ctl i.on::after{content:"";position:absolute;bottom:4px;left:50%;width:16px;margin-left:-8px;height:2px;border-radius:1px;background:#3DDC6A}
.gm .xc-ctl svg{width:15px;height:15px}
.gm .xc-lab{display:flex;gap:6px;margin-top:-2px}
.gm .xc-lab small{flex:1;min-width:0;text-align:center;font-size:10px;color:#A4A7AE}
.gm .xc-lab small:first-child{flex:2.1}
.gm .xc-lab small.on{color:#fff;font-weight:500}
.gm .xc-cards{display:flex;gap:8px}
.gm .xc-c{position:relative;flex:1;min-width:0;border:1px solid #3A3D45;background:linear-gradient(180deg,#2F3138,#25272D);border-radius:10px;padding:9px 10px;display:block;font-size:10.5px;min-height:100px}
.gm .xc-c>span,.gm .xc-c>small,.gm .xc-c>b{display:block;margin-top:2px}
.gm .xc-c>*{flex:none}
.gm .xc-c h5{margin:0 0 4px;font-size:9.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;line-height:1.25}
.gm .xc-c .xc-pc{font-size:20px;font-weight:400;color:#00C1C1;line-height:1}
.gm .xc-c b small{font-size:10px;margin-left:1px}
.gm .xc-c>span{color:#D5D7DB}
.gm .xc-c>small{color:#A4A7AE;margin-top:4px}
.gm .xc-c>b{font-size:16px;font-weight:400}
.gm .xc-c .xc-bar{position:relative;display:block;height:13px;border-radius:3px;background:#3A3D45;margin-top:8px;overflow:hidden}
.gm .xc-bar i{display:block;height:100%;background:#00C1C1}
.gm .xc-bar em{position:absolute;top:0;bottom:0;width:1.5px;background:#A4A7AE}
.gm .sk-cupra .m-tabs{background:#25272D;border-top:0}
.gm .sk-cupra .m-tabs>span{font-size:9px}
.gm .sk-cupra .m-tabs>span.on{color:#C27C4E}
.gm .b-cupra{margin:0 calc(-1*var(--px));padding:0}
.gm .bc-max{text-align:center;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#C9CBD0;padding:0 0 6px}
.gm .bc-vis{position:relative;height:150px;background:#30323A;overflow:hidden}
.gm .bc-fill{position:absolute;left:0;top:0;bottom:0;background:#14A3A3;background-image:repeating-linear-gradient(60deg,rgba(255,255,255,.08) 0 1px,transparent 1px 14px),repeating-linear-gradient(-60deg,rgba(255,255,255,.08) 0 1px,transparent 1px 14px)}
.gm .bc-car{position:absolute;left:20%;right:8%;top:54px;bottom:6px;border-radius:10px;color:#fff}
.gm .bc-lim{position:absolute;top:0;bottom:0;width:1.5px;background:rgba(255,255,255,.6)}
.gm .bc-val{position:absolute;left:10px;top:7px;line-height:1}
.gm .bc-val b{font-size:26px;font-weight:400}
.gm .bc-val small{font-size:12px;margin-left:1px}
.gm .bc-val span{display:block;font-size:16px;font-weight:300;margin-top:3px}
.gm .bc-st{display:flex;padding:9px 6px 8px;background:linear-gradient(180deg,#1F4547,#1E1F24)}
.gm .bc-st>div{flex:1;text-align:center;border-left:1px solid #3A3D45}
.gm .bc-st>div:first-child{border-left:0}
.gm .bc-st small{display:block;font-size:9.5px;color:#A4A7AE}
.gm .bc-st b{font-size:12.5px;font-weight:400}
.gm .bc-sh{margin:6px 8px 0;background:#2E3037;border-radius:16px 16px 0 0;padding:6px 12px 12px;display:flex;flex-direction:column;gap:2px}
.gm .bc-grab{align-self:center;width:28px;height:3px;border-radius:2px;background:#55585F;margin-bottom:6px}
.gm .bc-sh>b{font-size:15px;font-weight:400}
.gm .bc-sh>small{color:#A4A7AE;font-size:10.5px}
.gm .bc-sl{position:relative;display:block;height:15px;border-radius:3px;background:#3A3D45;margin:12px 0 4px}
.gm .bc-sl i{display:block;height:100%;background:#00C1C1;border-radius:3px 0 0 3px}
.gm .bc-sl em{position:absolute;top:-3px;width:9px;height:21px;margin-left:-4px;border-radius:3px;background:#fff}
.gm .bc-lb{display:flex;justify-content:space-between;font-size:9px;color:#A4A7AE}
.gm .sk-fiat.is-home .m-top{background:#E4E4E6;color:#1F1F1F}
.gm .xf{margin:-6px calc(-1*var(--px)) 0;background:#E4E4E6;padding:0 12px 10px}
.gm .xf-hd{display:flex;justify-content:space-between;align-items:center;height:28px}
.gm .xf-hd b{display:flex;align-items:center;gap:4px;font-size:15px;font-weight:600;min-width:0}
.gm .xf-hd .xf-dn{transform:rotate(90deg);width:12px;height:12px}
.gm .xf-hd span{display:flex;gap:12px}
.gm .xf-hd span svg{width:18px;height:18px}
.gm .xf-wm{text-align:center;font-weight:700;letter-spacing:.32em;font-size:11px;color:#3A3A3C;margin:0 0 6px}
.gm .xf-img{height:96px;border-radius:10px;color:#555}
.gm .xf-body{display:flex;flex-direction:column;gap:8px}
.gm .xf-c{position:relative;display:flex;align-items:center;gap:8px;background:#fff;border-radius:8px;padding:10px 12px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.gm .xf-b{flex:1;min-width:0}
.gm .xf-b>div{display:flex;align-items:baseline;gap:8px}
.gm .xf-b b{font-size:17px;font-weight:600;white-space:nowrap}
.gm .xf-b b small{font-size:10px;font-weight:500}
.gm .xf-b em{width:1px;height:14px;background:#D0D0D4;align-self:center}
.gm .xf-b>small{display:block;color:#6E6E73;font-size:9.5px}
.gm .xf-bat{display:block;width:90px;height:6px;border-radius:3px;background:#E2E2E5;margin-top:5px}
.gm .xf-bat i{display:block;height:100%;border-radius:3px;background:#43B02A}
.gm .xf-btn{flex:none;background:#00BCD4;color:#fff;font-weight:600;font-size:10.5px;padding:7px 9px;border-radius:4px}
.gm .xf-lk{justify-content:space-around}
.gm .xf-lk span{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600}
.gm .xf-lk svg{width:16px;height:16px}
.gm .xf-tr>b{flex:none;width:36px;height:36px;border:3px solid #43B02A;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#2E7D1E}
.gm .xf-tr div b{display:block;font-size:12px;font-weight:600}
.gm .xf-tr div small{display:block;color:#6E6E73;font-size:10px}
.gm .sk-fiat .m-btn{background:#00BCD4;color:#fff;text-transform:uppercase;letter-spacing:.06em;font-size:12px}
.gm .sk-ford.is-home .scr{background:radial-gradient(90% 38% at 15% 46%,rgba(46,123,246,.33),transparent 70%),#1C1C1E}
.gm .xo{display:flex;flex-direction:column;gap:7px}
.gm .xo-tb{display:flex;justify-content:space-between}
.gm .xo-tb span{width:32px;height:28px;background:#2C2C2E;border-radius:3px;display:flex;align-items:center;justify-content:center}
.gm .xo-tb svg{width:16px;height:16px}
.gm .xo-md{display:block;color:#A1A1A6;font-size:10.5px;margin-top:2px}
.gm .xo-st{display:block;font-size:24px;font-weight:500;line-height:1.1;margin-top:-6px}
.gm .xo-loc{display:flex;align-items:center;gap:8px;border:1px solid #2E7BF6;border-radius:3px;padding:8px 10px;background:#17181C;font-size:12px}
.gm .xo-loc span{flex:1}
.gm .xo-loc svg{width:15px;height:15px}
.gm .xo-img{height:86px;border-radius:4px;color:#fff}
.gm .xo-kpi{display:flex;justify-content:space-between;gap:8px}
.gm .xo-kpi>div:last-child{text-align:right}
.gm .xo-kpi small{display:flex;align-items:center;gap:3px;color:#A1A1A6;font-size:10px}
.gm .xo-kpi>div:last-child small{justify-content:flex-end}
.gm .xo-kpi svg{width:11px;height:11px}
.gm .xo-kpi b{font-size:15px;font-weight:500;white-space:nowrap}
.gm .xo-btn{display:flex;align-items:center;justify-content:center;gap:6px;background:#2C2C2E;border-radius:3px;height:36px;font-size:12px}
.gm .xo-btn svg{width:16px;height:16px}
.gm .xo-row{display:flex;gap:6px}
.gm .xo-row span{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;height:36px;background:#2C2C2E;border-radius:3px;font-size:11.5px}
.gm .xo-row span:last-child{flex:1.7}
.gm .xo-row svg{width:15px;height:15px}
.gm .xo-sec{display:block;font-size:16px;font-weight:500;margin-top:6px}
.gm .sk-ford .m-tabs{background:#1C1C1E;border-top:1px solid #2C2C2E}
.gm .sk-ford .m-tabs>span{color:#8E8E93}
.gm .sk-ford .m-tabs>span.on{color:#fff}
.gm .b-ford{display:flex;flex-direction:column;gap:9px;padding:0}
.gm .bf-loc{background:#2C2C2E;border-radius:4px;padding:9px 11px}
.gm .bf-loc small{display:block;color:#A1A1A6;font-size:10px}
.gm .bf-loc b{display:block;font-size:13px;font-weight:500;margin:1px 0}
.gm .bf-h{display:flex;align-items:baseline;gap:8px}
.gm .bf-h b{font-size:26px;font-weight:500}
.gm .bf-h span{color:#A1A1A6;font-size:12px}
.gm .bf-seg{position:relative;display:flex;gap:2px;height:16px}
.gm .bf-seg i{flex:1;background:#3A3A3C;border-radius:1px}
.gm .bf-seg i.on{background:#3DDC84}
.gm .bf-seg em{position:absolute;top:-4px;width:4px;height:24px;margin-left:-2px;background:#fff;border-radius:2px}
.gm .bf-go{text-align:center;background:#3A3A3C;color:#A1A1A6;border-radius:3px;padding:9px;font-size:12px}
.gm .sk-jlr.is-home .scr{background:linear-gradient(135deg,rgba(255,255,255,.04) 25%,transparent 25%) 0 0/40px 40px,linear-gradient(225deg,rgba(255,255,255,.04) 25%,transparent 25%) 0 0/40px 40px,linear-gradient(180deg,#252A30,#121417 58%)}
.gm .xj{display:flex;flex-direction:column;gap:7px}
.gm .xj-hd{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding:0 2px}
.gm .xj-hd>div{min-width:0}
.gm .xj-hd b{display:block;font-size:17px;font-weight:400;margin-bottom:3px}
.gm .xj-hd small{display:flex;align-items:center;gap:6px;white-space:nowrap;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#C5CBD1;margin-top:3px}
.gm .xj-hd small svg{width:11px;height:11px}
.gm .xj-hd>svg{width:20px;height:20px}
.gm .xj-img{height:100px;border-radius:8px;color:#fff}
.gm .xj-q{display:flex;justify-content:center;gap:12px}
.gm .xj-q i{width:38px;height:38px;border-radius:50%;background:#2A3036;display:flex;align-items:center;justify-content:center}
.gm .xj-q svg{width:17px;height:17px}
.gm .xj-c{position:relative;display:flex;align-items:center;gap:12px;background:#1D2125;border-radius:10px;padding:11px 12px;font-size:12.5px}
.gm .xj-c>svg{width:17px;height:17px;color:#C5CBD1}
.gm .xj-c span{flex:1;min-width:0}
.gm .xj-c small{display:block;color:#9BA3AB;font-size:10.5px;margin-top:2px}
.gm .xj-c>svg:last-child{width:14px;height:14px;color:#9BA3AB}
/* --- Lote 2: Jeep, Maserati, Kia, Leapmotor, Lexus, Lotus, Lucid, Lynk & Co, Land Rover --- */
.gm .xje-img,.gm .xm-img,.gm .xk-img,.gm .xl-img,.gm .xx-img,.gm .xt-img,.gm .xu-img,.gm .xy-img{display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}
.gm .xje-img img,.gm .xm-img img,.gm .xk-img img,.gm .xl-img img,.gm .xx-img img,.gm .xt-img img,.gm .xu-img img,.gm .xy-img img{display:block;width:100%;height:100%;object-fit:cover}
.gm .xje-img>svg,.gm .xm-img>svg,.gm .xk-img>svg,.gm .xl-img>svg,.gm .xx-img>svg,.gm .xt-img>svg,.gm .xu-img>svg,.gm .xy-img>svg{width:150px;color:currentColor;opacity:.55}
.gm .xje svg,.gm .xje-g svg,.gm .xje-lk svg,.gm .xm svg,.gm .xm-g svg,.gm .xk svg,.gm .xl svg,.gm .xx svg,.gm .xt svg,.gm .xu svg,.gm .xy svg,.gm .b-lynk svg{stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
/* Jeep */
.gm .xje{margin:-6px calc(-1*var(--px)) 0;background:linear-gradient(180deg,#2B2B2B 0,#4E5560 55%,#9AA1A9 100%);color:#fff;padding:0 12px 10px;flex:none}
.gm .xje-hd{display:flex;justify-content:space-between;align-items:center;height:28px}
.gm .xje-hd b{display:flex;align-items:center;gap:4px;font-size:15px;font-weight:500;min-width:0}
.gm .xje-hd .xje-dn{transform:rotate(90deg);width:12px;height:12px}
.gm .xje-hd span{display:flex;gap:12px}
.gm .xje-hd span svg{width:18px;height:18px}
.gm .xje-img{height:108px;border-radius:4px;color:#fff;margin-top:4px}
.gm .xje-g{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:none}
.gm .xje-c{position:relative;background:#fff;border-radius:4px;padding:10px;box-shadow:0 1px 3px rgba(0,0,0,.1);min-width:0}
.gm .xje-rg b{display:block;font-size:24px;font-weight:500;line-height:1}
.gm .xje-c small{display:block;font-size:9.5px;color:#6B6B6B;margin-top:2px}
.gm .xje-bars{display:flex;gap:3px;align-items:flex-end;height:24px;margin-top:6px}
.gm .xje-bars i{width:8px;background:#43B02A;border-radius:1px}
.gm .xje-ok{display:flex;flex-direction:column;justify-content:center}
.gm .xje-ok>i{width:30px;height:30px;border-radius:50%;background:#E3F3DD;color:#2E8B1E;display:flex;align-items:center;justify-content:center;margin-bottom:6px}
.gm .xje-ok>i svg{width:16px;height:16px}
.gm .xje-ok b{font-size:15px;font-weight:500;line-height:1}
.gm .xje-lk{display:flex;justify-content:space-around;flex:none}
.gm .xje-lk span{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:500}
.gm .xje-lk svg{width:16px;height:16px}
.gm .xje-btn{flex:none;background:#1A1A1A;color:#fff;text-align:center;font-size:11.5px;font-weight:500;padding:10px;border-radius:3px}
.gm .sk-jeep .m-btn{background:#F2C200;color:#1A1A1A;text-transform:uppercase;letter-spacing:.05em;font-size:12px}
.gm .sk-jeep:not(.is-home) .m-nav{border-bottom:3px solid #F2C200}
/* Maserati */
.gm .sk-maserati.is-home .m-top{background:#3A3A3A;color:#fff}
.gm .xm{margin:-6px calc(-1*var(--px)) 0;flex:none}
.gm .xm-hd{background:#3A3A3A;color:#fff;display:flex;justify-content:space-between;align-items:center;height:30px;padding:0 14px}
.gm .xm-hd b{font-size:14px;font-weight:400;letter-spacing:.03em;min-width:0}
.gm .xm-hd span{display:flex;gap:12px}
.gm .xm-hd svg{width:17px;height:17px}
.gm .xm-img{height:118px;background:linear-gradient(180deg,#2F2F2F,#646464);color:#fff}
.gm .xm-g{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:none}
.gm .xm-c{position:relative;background:#fff;border-radius:2px;padding:10px 6px;box-shadow:0 1px 2px rgba(0,0,0,.1);display:flex;flex-direction:column;align-items:center;gap:3px;text-align:center;min-width:0}
.gm .xm-c b{font-size:21px;font-style:italic;font-weight:300;line-height:1.1}
.gm .xm-c small{font-size:9px;color:#707070}
.gm .xm-g .xm-gg{width:36px;height:36px;stroke-width:3}
.gm .xm-g .xm-gg circle{fill:none}
.gm .xm-g .xm-gg .t{stroke:#E2E2E2}
.gm .xm-g .xm-gg .v{stroke:#2DB34A}
.gm .xm-ok>i{width:36px;height:36px;border-radius:50%;background:#2DB34A;color:#fff;display:flex;align-items:center;justify-content:center}
.gm .xm-ok>i svg{width:18px;height:18px}
.gm .xm-lk{flex:none;flex-direction:row;justify-content:space-around;padding:9px 6px}
.gm .xm-lk span{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:9.5px}
.gm .xm-lk svg{width:17px;height:17px}
.gm .sk-maserati .m-btn{background:#0C2340;color:#fff;text-transform:uppercase;letter-spacing:.08em;font-size:11.5px}
/* Kia */
.gm .sk-kia.is-home .scr{background:radial-gradient(75% 28% at 50% 42%,#1D3443,transparent 72%),#05141F}
.gm .xk{display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center}
.gm .xk-nm{white-space:nowrap;display:flex;align-items:center;gap:3px;font-size:12px;color:#C9D4DC}
.gm .xk-dn{transform:rotate(90deg);width:11px;height:11px}
.gm .xk-pc{display:flex;align-items:flex-start;line-height:1}
.gm .xk-pc b{font-size:38px;font-weight:300}
.gm .xk-pc small{font-size:12px;margin-top:5px}
.gm .xk-bar{display:block;width:120px;height:3px;border-radius:2px;background:#203645}
.gm .xk-bar i{display:block;height:100%;border-radius:2px;background:#5BD27A}
.gm .xk-km{font-size:10px;color:#9FB0BC}
.gm .xk-img{width:100%;height:112px;border-radius:12px;color:#fff;margin:2px 0}
.gm .xk-q{display:flex;justify-content:space-between;width:206px;flex:none;background:#132633;border-radius:18px;padding:6px}
.gm .xk-q i{flex:none;position:relative;width:44px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#E6EDF2}
.gm .xk-q svg{width:18px;height:18px}
.gm .xk-w{align-self:stretch;display:flex;align-items:center;gap:8px;background:#0E202C;border-radius:14px;padding:10px 12px;font-size:11px;margin-top:4px}
.gm .xk-w svg{width:18px;height:18px;color:#F5C451}
.gm .xk-w b{font-weight:500;font-size:13px}
.gm .xk-w span{margin-left:auto;color:#9FB0BC}
.gm .sk-kia .m-btn{background:#fff;color:#05141F}
/* Leapmotor */
.gm .sk-leap.is-home .scr{background:linear-gradient(180deg,#C8EEDC 0,#E4F6EE 32%,#F4F7F6 58%)}
.gm .sk-leap:not(.is-home) .scr{background:linear-gradient(180deg,#D9F3E7 0,#F4F7F6 28%)}
.gm .xl{display:flex;flex-direction:column;gap:6px}
.gm .xl-hd b{display:flex;align-items:center;gap:3px;font-size:15px;font-weight:600}
.gm .xl-dn{transform:rotate(90deg);width:11px;height:11px}
.gm .xl-hd small{display:block;font-size:9px;color:#7B8582;margin-top:1px}
.gm .xl-rg{display:flex;align-items:center;gap:6px}
.gm .xl-rg b{font-size:30px;font-weight:600;line-height:1}
.gm .xl-rg b small{font-size:11px;font-weight:500;margin-left:2px}
.gm .xl-bt{display:block;width:22px;height:11px;border:1.5px solid #17A673;border-radius:3px;padding:1px}
.gm .xl-bt em{display:block;height:100%;background:#17A673;border-radius:1px}
.gm .xl-rg span{margin-left:auto;white-space:nowrap;flex:none;display:flex;align-items:center;gap:3px;font-size:9.5px;color:#4A524F}
.gm .xl-rg span svg{width:11px;height:11px}
.gm .xl-cc{position:relative;white-space:nowrap;align-self:flex-start;display:inline-flex;align-items:center;gap:3px;color:#17A673;font-size:11px;font-weight:600;padding:3px 6px;margin-left:-6px;border-radius:8px}
.gm .xl-cc svg{width:13px;height:13px}
.gm .xl-img{height:100px;border-radius:12px;color:#555}
.gm .xl-pk{text-align:center;font-size:9.5px;color:#7B8582}
.gm .xl-q{display:flex;justify-content:space-between;padding:0 4px}
.gm .xl-q span{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:9px;color:#4A524F}
.gm .xl-q i{width:40px;height:40px;border-radius:50%;background:#fff;box-shadow:0 1px 5px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center}
.gm .xl-q svg{width:17px;height:17px}
.gm .xl-cl{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(90deg,#D6F1E5,#EEF9F4);border-radius:12px;padding:9px 12px}
.gm .xl-cl b{display:block;font-size:20px;font-weight:500;line-height:1.1}
.gm .xl-cl b small{font-size:10px}
.gm .xl-cl small{font-size:9px;color:#4A524F}
.gm .xl-cl>i{width:30px;height:30px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;color:#17A673}
.gm .xl-cl>i svg{width:15px;height:15px}
.gm .sk-leap .m-tabs{background:#fff}
.gm .sk-leap .m-btn{background:#1F2321;color:#fff}
.gm .b-leap{display:flex;flex-direction:column;gap:8px;padding:4px 2px}
.gm .bl-h{text-align:center}
.gm .bl-h b{font-size:32px;font-weight:600;line-height:1}
.gm .bl-h b small{font-size:13px}
.gm .bl-h>small{display:block;font-size:10px;color:#7B8582;margin-top:3px}
.gm .bl-c{display:block;height:30px;border:2px solid #C9D3D0;border-radius:10px;padding:3px;background:#fff}
.gm .bl-c i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#7FE0B4,#17A673)}
.gm .bl-st{display:grid;grid-template-columns:repeat(3,1fr);text-align:center}
.gm .bl-st small{display:block;font-size:9px;color:#7B8582}
.gm .bl-st b{font-size:11.5px;font-weight:600}
/* Lexus */
.gm .xx{display:flex;flex-direction:column;align-items:center;gap:7px;text-align:center;font-weight:300}
.gm .xx-g{white-space:nowrap;border:1px solid #1A1A1A;padding:3px 9px;font-size:10px;font-weight:400}
.gm .xx-img{width:100%;height:110px;color:#555}
.gm .xx-k{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:6px;width:100%}
.gm .xx-k>div>b{display:block;font-size:12px;font-weight:400}
.gm .xx-k>div>small{font-size:8.5px;color:#767676}
.gm .xx-bt{position:relative;border:1px solid #E6E6E6;box-shadow:0 1px 4px rgba(0,0,0,.06);padding:6px 12px;display:flex;flex-direction:column;align-items:center;gap:2px}
.gm .xx-bt svg{width:18px;height:18px;color:#2DB34A}
.gm .xx-bt b{font-size:12.5px;font-weight:600}
.gm .xx-up{font-size:9px;color:#767676}
.gm .xx-vs{display:flex;align-items:center;gap:5px;white-space:nowrap;font-size:11px;font-weight:400}
.gm .xx-vs svg{width:14px;height:14px;color:#2DB34A}
.gm .xx-rc{align-self:stretch;border:1px solid #ECECEC;box-shadow:0 2px 8px rgba(0,0,0,.05);padding:10px 12px;text-align:left}
.gm .xx-rc b{display:flex;justify-content:space-between;align-items:center;font-size:10.5px;font-weight:400;letter-spacing:.1em}
.gm .xx-rc b svg{width:14px;height:14px}
.gm .xx-rc>i{display:flex;justify-content:center;padding:10px 0 4px}
.gm .xx-rc>i svg{width:26px;height:26px;stroke-width:1.3}
.gm .sk-lexus .m-tabs{background:#fff;border-top:1px solid #EEEEEE}
.gm .sk-lexus .m-tabs>span{color:#9A9A9A}
.gm .sk-lexus .m-tabs>span.on{color:#1A1A1A}
.gm .sk-lexus .m-btn{background:#000;color:#fff;text-transform:uppercase;letter-spacing:.08em;font-size:11.5px;border-radius:0}
/* Lotus */
.gm .sk-lotus.is-home .scr{background:linear-gradient(180deg,#76848E 0,#98A2A9 16%,#4A5056 38%,#1A1B1E 58%)}
.gm .xt{display:flex;flex-direction:column;gap:7px}
.gm .xt-hd{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.gm .xt-hd>div{flex:1;min-width:0}
.gm .xt-hd b{display:block;white-space:nowrap;font-size:15px;font-weight:600}
.gm .xt-hd b svg{vertical-align:middle;margin-left:3px}
.gm .xt-hd b svg{width:12px;height:12px}
.gm .xt-hd small{display:block;font-size:8.5px;color:#E2E6EA;margin-top:2px}
.gm .xt-hd>span{display:flex;gap:9px;flex:none}
.gm .xt-hd>span svg{width:16px;height:16px}
.gm .xt-img{height:104px;border-radius:4px;color:#fff}
.gm .xt-st{text-align:center;font-size:9.5px;color:#C9CCD0}
.gm .xt-q{display:grid;grid-template-columns:repeat(4,1fr);background:#2A2B2F;border-radius:4px;padding:8px 2px}
.gm .xt-q span{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:8.5px;color:#C9CCD0}
.gm .xt-q span.on{color:#FFF200}
.gm .xt-q svg{width:16px;height:16px}
.gm .xt-g{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.gm .xt-c{position:relative;background:#2A2B2F linear-gradient(135deg,rgba(255,255,255,.06),transparent 60%);border-radius:4px;padding:9px 10px;display:flex;flex-direction:column;gap:2px;min-width:0}
.gm .xt-c small{font-size:9px;color:#A0A3A8}
.gm .xt-c b{font-size:20px;font-weight:500;line-height:1.1}
.gm .xt-c b small{font-size:10px;color:inherit}
.gm .xt-bar{display:block;height:3px;background:#3A3C41;border-radius:2px;margin-top:4px}
.gm .xt-bar i{display:block;height:100%;background:#FFF200;border-radius:2px}
.gm .xt-s{padding:8px 10px}
.gm .sk-lotus .m-btn{background:#FFF200;color:#111}
/* Lucid */
.gm .xu{display:flex;flex-direction:column;gap:8px}
.gm .xu-cd{background:#1F1F1F;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:4px}
.gm .xu-hd{display:flex;justify-content:space-between;align-items:center;gap:6px}
.gm .xu-hd b{display:block;white-space:nowrap;font-size:14px;font-weight:300;letter-spacing:.02em;min-width:0}
.gm .xu-hd b svg{vertical-align:middle;margin-left:4px}
.gm .xu-dn{transform:rotate(90deg);width:11px;height:11px}
.gm .xu-bt{flex:none;display:flex;align-items:center;gap:5px;white-space:nowrap;font-size:12px;font-weight:300}
.gm .xu-bt svg{width:16px;height:16px}
.gm .xu-pk{display:flex;align-items:center;gap:3px;font-size:9.5px;color:#9A9A9A}
.gm .xu-pk svg{width:10px;height:10px}
.gm .xu-img{height:104px;border-radius:8px;color:#fff;margin:4px 0}
.gm .xu-q{display:flex;justify-content:space-around}
.gm .xu-q i{width:36px;height:36px;border-radius:50%;border:1px solid #3A3A3A;display:flex;align-items:center;justify-content:center;color:#DADADA}
.gm .xu-q i.on{color:#C2A26B;border-color:#C2A26B}
.gm .xu-q svg{width:16px;height:16px}
.gm .xu-r{position:relative;display:flex;align-items:center;gap:10px;background:#1F1F1F;border-radius:12px;padding:12px;font-size:12.5px;font-weight:300}
.gm .xu-r>svg{width:16px;height:16px;color:#DADADA}
.gm .xu-r>svg:last-child{width:13px;height:13px;color:#7A7A7A}
.gm .xu-r span{flex:1;min-width:0}
.gm .xu-r small{color:#9A9A9A}
.gm .sk-lucid .m-btn{background:transparent;color:#fff;border:1px solid #fff;text-transform:uppercase;letter-spacing:.1em;font-size:11px}
/* Lynk & Co */
.gm .sk-lynk.is-home .scr{background:radial-gradient(80% 26% at 50% 28%,#20302C,transparent 72%),#161616}
.gm .xy{display:flex;flex-direction:column;gap:7px}
.gm .xy-hd{display:flex;justify-content:space-between;align-items:center}
.gm .xy-pl{border:1px solid #4A4A4A;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:600;letter-spacing:.08em}
.gm .xy-hd>svg{width:17px;height:17px;color:#BDBDBD}
.gm .xy-img{height:104px;border-radius:10px;color:#fff}
.gm .xy-lk{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.gm .xy-lk i{height:38px;border-radius:10px;background:#232323;display:flex;align-items:center;justify-content:center;color:#DADADA}
.gm .xy-lk i.on{background:#173A33;color:#2EF0C8}
.gm .xy-lk svg{width:17px;height:17px}
.gm .xy-r{position:relative;display:flex;align-items:center;gap:10px;background:#232323;border-radius:10px;padding:10px 12px}
.gm .xy-r>svg{width:16px;height:16px;color:#DADADA}
.gm .xy-r>svg:last-child{width:13px;height:13px;color:#7A7A7A}
.gm .xy-r>span{flex:1;min-width:0;font-size:12px}
.gm .xy-r small{display:block;font-size:9.5px;color:#9A9A9A;margin-top:1px}
.gm .xy-pb{display:block;height:4px;border-radius:2px;background:#383838;margin-top:5px}
.gm .xy-pb i{display:block;height:100%;border-radius:2px;background:#2EF0C8}
.gm .sk-lynk .m-tabs{background:#161616;border-top:1px solid #262626}
.gm .sk-lynk .m-tabs>span{color:#8A8A8A}
.gm .sk-lynk .m-tabs>span.on{color:#2EF0C8}
.gm .sk-lynk .m-btn{background:transparent;color:#fff;border:1px solid #fff}
.gm .b-lynk{display:flex;flex-direction:column;gap:3px;padding:2px}
.gm .by-ch{display:flex;align-items:center;gap:5px;font-size:10.5px;color:#DADADA}
.gm .by-ch svg{width:14px;height:14px;padding:2px;border-radius:50%;background:#2EF0C8;color:#0B0B0B}
.gm .by-km{font-size:28px;font-weight:500;line-height:1.1}
.gm .by-km small{font-size:11px;font-weight:400}
.gm .by-up{font-size:9px;color:#8A8A8A}
.gm .by-bar{position:relative;display:block;height:30px;border-radius:999px;background:#1F3A35;margin-top:8px;overflow:hidden}
.gm .by-bar i{display:flex;align-items:center;height:100%;border-radius:999px;background:#2EF0C8;color:#0B0B0B;font-style:normal;font-size:10px;font-weight:600;padding-left:10px}
.gm .by-bar em{position:absolute;top:0;bottom:0;width:2px;background:#E6E6E6}
/* Land Rover (versão clara da app JLR) */
.gm .sk-landrover.is-home .scr{background:linear-gradient(135deg,rgba(0,0,0,.035) 25%,transparent 25%) 0 0/40px 40px,linear-gradient(225deg,rgba(0,0,0,.035) 25%,transparent 25%) 0 0/40px 40px,linear-gradient(180deg,#E6E9EC,#FFFFFF 58%)}
.gm .sk-landrover .xj-hd small{color:#5F6368}
.gm .sk-landrover .xj-img{color:#555}
.gm .sk-landrover .xj-q i{background:#E6E8EB}
.gm .sk-landrover .xj-c{background:#F2F3F5}
.gm .sk-landrover .xj-c>svg{color:#3A3D40}
.gm .sk-landrover .xj-c small{color:#6B6F75}
.gm .sk-landrover .xj-c>svg:last-child{color:#8A8F95}
.gm .sk-landrover .m-btn{background:#1A1A1A;color:#fff}
/* --- Lote 3: Mercedes-Benz, MG, MINI, Alpine/Dacia, Bentley, BMW, GWM, Honda --- */
.gm .xmb-img,.gm .xg-img,.gm .xn-img,.gm .xa-img,.gm .xe-img,.gm .xw-img,.gm .xo-img,.gm .xh-img,.gm .bg-img{display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}
.gm .xmb-img img,.gm .xg-img img,.gm .xn-img img,.gm .xa-img img,.gm .xe-img img,.gm .xw-img img,.gm .xo-img img,.gm .xh-img img,.gm .bg-img img{display:block;width:100%;height:100%;object-fit:cover}
.gm .xmb-img>svg,.gm .xg-img>svg,.gm .xn-img>svg,.gm .xa-img>svg,.gm .xe-img>svg,.gm .xw-img>svg,.gm .xo-img>svg,.gm .xh-img>svg,.gm .bg-img>svg{width:140px;color:currentColor;opacity:.55}
.gm .xmb svg,.gm .xmb-bt svg,.gm .xmb-rc svg,.gm .xg svg,.gm .xg-g svg,.gm .xn svg,.gm .xn-q svg,.gm .xn-c svg,.gm .xa svg,.gm .xa-q svg,.gm .xa-r svg,.gm .xe svg,.gm .xw svg,.gm .xw-g svg,.gm .xw-q svg,.gm .xo svg,.gm .xo-qc svg,.gm .xh svg,.gm .b-merc svg,.gm .b-bmw svg{stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
/* Mercedes-Benz */
.gm .sk-mercedes.is-home .m-top{background:#000;color:#fff}
.gm .sk-mercedes.is-home .m-body,.gm .sk-mini.is-home .m-body{padding-top:6px}
.gm .sk-mercedes .m-nav b{font-family:var(--hf);font-weight:400}
.gm .xmb{margin:-6px calc(-1*var(--px)) 0;flex:none}
.gm .xmb-hd{background:#000;color:#fff;display:flex;align-items:center;justify-content:space-between;height:30px;padding:0 12px}
.gm .xmb-hd b{font:400 14px/1 var(--hf);letter-spacing:.01em}
.gm .xmb-hd svg{width:17px;height:17px}
.gm .xmb-hero{background:linear-gradient(180deg,#0B2A6B 0,#2E5FB8 55%,#C9D6EA 100%);color:#fff;text-align:center;padding:10px 12px 8px}
.gm .xmb-hero>b{display:block;font:400 17px/1.15 var(--hf)}
.gm .xmb-hero small{display:flex;align-items:center;justify-content:center;gap:4px;font-size:10px;opacity:.9;margin-top:3px}
.gm .xmb-hero small svg{width:11px;height:11px}
.gm .xmb-hero .xmb-up{font-size:9px;opacity:.75}
.gm .xmb-img{height:96px;margin-top:4px;color:#fff}
.gm .xmb-dots{display:flex;justify-content:center;gap:4px;margin-top:4px}
.gm .xmb-dots i{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.5)}
.gm .xmb-dots i.on{background:#fff}
.gm .xmb-bt{flex:none;background:#fff;border-radius:10px;padding:10px 12px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.gm .xmb-bt b{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600}
.gm .xmb-bt b svg{width:16px;height:16px}
.gm .xmb-bar,.gm .bm-bar{position:relative;display:block;height:5px;border-radius:3px;background:#E3E6EB;margin-top:8px}
.gm .xmb-bar i,.gm .bm-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:#0078D6}
.gm .xmb-bar em,.gm .bm-bar em{position:absolute;top:-3px;width:3px;height:11px;border-radius:2px;background:#F2C230}
.gm .xmb-rc{flex:none;background:#fff;border-radius:10px;padding:10px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.gm .xmb-rh{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.gm .xmb-rh b{font-size:12px;font-weight:600}
.gm .xmb-rh span{font-size:11px;color:#0078D6;font-weight:600}
.gm .xmb-t{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.gm .xmb-t span{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:9px;color:#444;min-width:0}
.gm .xmb-t i{width:100%;aspect-ratio:1;max-height:46px;border-radius:8px;background:#EEF0F3;display:flex;align-items:center;justify-content:center;color:#1A1A1A}
.gm .xmb-t svg{width:18px;height:18px}
.gm .b-merc{background:#fff;border-radius:10px;padding:12px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.gm .b-merc>b{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:600}
.gm .b-merc>b svg{width:17px;height:17px}
.gm .b-merc .bt-s{margin-top:8px}
.gm .sk-mercedes .m-btn{background:linear-gradient(180deg,#1F7FE0,#0058B8);color:#fff;border-radius:10px}
/* MG iSMART */
.gm .xg{margin:-6px calc(-1*var(--px)) 0;background:linear-gradient(180deg,#CFE3FA 0,#E8F1FC 60%,#F2F6FB 100%);padding:0 12px 10px;flex:none}
.gm .xg-hd{display:flex;align-items:center;justify-content:space-between;height:28px}
.gm .xg-hd b{display:flex;align-items:center;gap:5px;font-size:15px;font-weight:700;white-space:nowrap}
.gm .xg-hd svg{width:16px;height:16px}
.gm .xg-rg{display:flex;align-items:flex-end;gap:6px;margin-top:2px}
.gm .xg-rg b{font-size:30px;font-weight:700;line-height:1}
.gm .xg-rg small{font-size:9.5px;color:#4B5563;line-height:1.2;padding-bottom:3px}
.gm .xg-img{height:92px;color:#1A1A1A}
.gm .xg-q{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-radius:12px;padding:8px 4px;box-shadow:0 2px 6px rgba(31,111,229,.08)}
.gm .xg-q span{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:9px;color:#374151;min-width:0}
.gm .xg-q i{width:30px;height:30px;border-radius:50%;background:#F1F4F8;display:flex;align-items:center;justify-content:center}
.gm .xg-q i svg{width:16px;height:16px}
.gm .xg-q .on i{background:#1F6FE5;color:#fff}
.gm .xg-ks{margin-top:8px;display:flex;align-items:center;justify-content:center;gap:6px;background:#1F6FE5;color:#fff;border-radius:999px;padding:7px;font-size:11px;font-weight:600}
.gm .xg-ks svg{width:14px;height:14px}
.gm .xg-g{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:none}
.gm .xg-c{position:relative;background:#fff;border-radius:12px;padding:10px;box-shadow:0 1px 3px rgba(0,0,0,.06);min-width:0}
.gm .xg-c>span{display:flex;align-items:center;gap:5px;font-size:10.5px;color:#4B5563}
.gm .xg-c>span svg{width:15px;height:15px;color:#1F6FE5}
.gm .xg-c b{display:block;font-size:16px;font-weight:700;margin-top:4px}
/* MINI */
.gm .sk-mini.is-home .m-top{background:#C4561F;color:#fff}
.gm .sk-mini:not(.is-home) .m-top{position:relative;background:#C4561F;padding-bottom:16px}
.gm .sk-mini:not(.is-home) .m-top::after{content:"";position:absolute;left:0;right:0;bottom:4px;height:22px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 22' preserveAspectRatio='none'%3E%3Cpath d='M0 20 C120 20 170 19 200 10 S240 2 256 2' fill='none' stroke='%23F4C430' stroke-width='2'/%3E%3C/svg%3E") no-repeat;background-size:100% 100%}
.gm .sk-mini .m-nav b{font-family:var(--hf);font-weight:400}
.gm .sk-mini .m-sect{text-transform:uppercase;letter-spacing:.06em}
.gm .xn{margin:-6px calc(-1*var(--px)) 0;background-color:#C4561F;background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.06) 0 2px,transparent 2px 14px);color:#fff;padding:0 12px;flex:none;position:relative}
.gm .xn-hd{display:flex;align-items:center;justify-content:space-between;height:26px}
.gm .xn-hd b{font-size:11px;font-weight:600}
.gm .xn-hd svg{width:16px;height:16px}
.gm .xn-ok{display:block;font:400 28px/1 var(--hf);margin-top:6px}
.gm .xn-up{display:block;font-size:8.5px;opacity:.85;margin-top:5px}
.gm .xn-cs{display:inline-block;background:#fff;color:#1A1A1A;border-radius:999px;font-size:9.5px;font-weight:600;padding:4px 10px;margin-top:6px}
.gm .xn-row{display:flex;align-items:flex-end;justify-content:space-between;margin-top:8px}
.gm .xn-soc{position:relative;border-radius:6px;padding:4px 6px;margin-left:-6px}
.gm .xn-soc small{display:block;font-size:9px;opacity:.9}
.gm .xn-soc b{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:600;line-height:1.35}
.gm .xn-soc b svg{width:12px;height:12px}
.gm .xn-arc{width:84px;height:44px}
.gm .xn-img{height:84px;margin:0 -12px;color:#fff;background:radial-gradient(70% 55% at 50% 100%,#fff 98%,transparent 100%)}
.gm .xn-q{display:flex;justify-content:space-around;background:#F0F0F0;border-radius:4px;padding:9px 4px;flex:none;color:#333}
.gm .xn-q svg{width:17px;height:17px}
.gm .xn-c{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:none}
.gm .xn-c>div{display:flex;align-items:center;gap:6px;background:#F3F3F3;border-radius:4px;padding:10px 8px;font-size:10.5px;font-weight:600;min-width:0}
.gm .xn-c svg{width:15px;height:15px;color:#C4561F}
.gm .sk-mini .m-btn{background:#1A1A1A;color:#fff;text-transform:uppercase;letter-spacing:.06em;font-size:11.5px}
/* Alpine / Dacia (mesma plataforma de app) */
.gm .xa{margin:-6px calc(-1*var(--px)) 0;padding:0 12px;flex:none;background:linear-gradient(180deg,#05070A 0,var(--bg) 100%)}
.gm .xa-hd{display:flex;align-items:center;justify-content:space-between;height:30px}
.gm .xa-hd b{font-size:20px;font-weight:700;letter-spacing:.02em}
.gm .xa-hd svg{width:17px;height:17px}
.gm .xa-img{height:98px;color:#fff}
.gm .xa-rg b{display:block;font-size:24px;font-weight:700;line-height:1}
.gm .xa-rg b small{font-size:13px;font-weight:500}
.gm .xa-bar{display:block;height:5px;border-radius:3px;background:var(--line);margin:7px 0 4px;position:relative}
.gm .xa-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:var(--acc)}
.gm .xa-rg small{font-size:10px;color:var(--mut)}
.gm .xa-q{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;flex:none}
.gm .xa-q span{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;background:var(--card);border-radius:8px;padding:10px 4px;font-size:9.5px;text-align:center;min-width:0}
.gm .xa-q svg{width:18px;height:18px;color:var(--acct)}
.gm .xa-sec{flex:none;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-top:2px}
.gm .xa-r{position:relative;flex:none;display:flex;align-items:center;gap:10px;background:var(--card);border-radius:8px;padding:10px}
.gm .xa-r>i{width:30px;height:30px;border-radius:50%;background:var(--pill);display:flex;align-items:center;justify-content:center;color:var(--acct)}
.gm .xa-r>i svg{width:16px;height:16px}
.gm .xa-r span{flex:1;min-width:0;font-size:12px;font-weight:600}
.gm .xa-r small{display:block;font-size:9.5px;color:var(--mut);font-weight:400;margin-top:1px}
.gm .xa-r>svg{width:14px;height:14px;color:var(--mut)}
.gm .sk-dacia .xa-hd b{text-transform:uppercase;letter-spacing:.06em}
.gm .sk-dacia .m-btn,.gm .sk-alpine .m-btn{border-radius:6px}
/* Bentley */
.gm .xe{margin:-6px calc(-1*var(--px)) 0;padding:0 12px;flex:none;text-align:center}
.gm .xe-hd{height:30px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:300;letter-spacing:.32em}
.gm .xe-car{display:flex;align-items:center;gap:4px}
.gm .xe-car>span{color:#9A9A92}
.gm .xe-car>span svg{width:16px;height:16px}
.gm .xe-img{flex:1;height:92px;color:#1A1A1A}
.gm .xe-gm{font-size:11px;color:#76766F;margin-top:4px}
.gm .xe-nm{display:block;font-size:15px;font-weight:400;letter-spacing:.18em;margin-top:2px}
.gm .xe>small{display:block;font-size:9px;color:#76766F;margin-top:3px}
.gm .xe-lk{display:flex;justify-content:center;gap:10px;margin-top:10px}
.gm .xe-lk i{width:44px;height:44px;background:#2F5D4B;color:#fff;display:flex;align-items:center;justify-content:center}
.gm .xe-lk i svg{width:18px;height:18px;stroke:#fff}
.gm .xe-st{display:block;font-size:10px;color:#4A4A44;margin-top:6px}
.gm .xe-rg{position:relative;flex:none;display:flex;align-items:center;gap:12px;border:1px solid #E6E6E0;padding:8px 10px;text-align:left}
.gm .xe-rg .m-rg{width:48px;height:48px}
.gm .xe-rg div{flex:1;min-width:0}
.gm .xe-rg b{display:block;font-size:15px;font-weight:500}
.gm .xe-rg small{display:block;font-size:9.5px;color:#76766F;letter-spacing:.06em;text-transform:uppercase;margin-top:2px}
.gm .xe-rg>svg{width:14px;height:14px;color:#9A9A92;stroke:currentColor;fill:none;stroke-width:1.8}
.gm .xe-cl{display:grid;grid-template-columns:1fr 1fr;flex:none;border:1px solid #E6E6E0}
.gm .xe-cl div{padding:8px 10px;text-align:left}
.gm .xe-cl div+div{border-left:1px solid #E6E6E0}
.gm .xe-cl small{display:block;font-size:8.5px;letter-spacing:.08em;text-transform:uppercase;color:#76766F}
.gm .xe-cl b{display:block;font-size:12px;font-weight:500;margin-top:2px}
.gm .sk-bentley .m-nav b{font-weight:300;letter-spacing:.2em}
.gm .sk-bentley .m-btn{background:#2F5D4B;letter-spacing:.14em;text-transform:uppercase;font-weight:500;font-size:11px}
/* BMW */
.gm .sk-bmw.is-home .m-top,.gm .sk-bmw.top-batt .m-top{background:#1C2A52;color:#fff}
.gm .sk-bmw.top-batt .m-top{background:#1D3E8A}
.gm .xw{margin:-6px calc(-1*var(--px)) 0;background:linear-gradient(180deg,#1C2A52 0,#3A4673 70%,#5E6A90 100%);color:#fff;padding:0 12px 6px;flex:none;position:relative}
.gm .xw-hd{display:flex;align-items:center;justify-content:space-between;height:26px}
.gm .xw-hd b{font-size:10.5px;font-weight:600}
.gm .xw-hd svg{width:15px;height:15px}
.gm .xw-ok{position:relative;z-index:1;display:block;font-size:30px;font-weight:800;line-height:.98;letter-spacing:-.01em;margin-top:8px}
.gm .xw-img{height:86px;margin-top:6px;color:#fff;position:relative;z-index:0}
.gm .xw-img img{object-fit:contain;padding:0 6px}
.gm .xw-g{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:none}
.gm .xw-c{position:relative;background:#F2F3F5;border-radius:6px;padding:8px 9px;min-width:0}
.gm .xw-c b{display:block;font-size:11px;font-weight:600}
.gm .xw-c small{display:block;font-size:9px;color:#6F737A;margin-top:1px}
.gm .xw-c>span{display:flex;align-items:center;justify-content:space-between;gap:4px;margin-top:8px}
.gm .xw-c>span svg{width:15px;height:15px}
.gm .xw-c em{font-style:normal;font-size:14px;font-weight:700}
.gm .xw-q{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;flex:none}
.gm .xw-q i{height:30px;border-radius:4px;background:#F2F3F5;display:flex;align-items:center;justify-content:center;color:#1A1A1A}
.gm .xw-q i.on{background:#1A1A1A;color:#fff}
.gm .xw-q svg{width:15px;height:15px}
.gm .b-bmw{margin:-6px calc(-1*var(--px)) 0;background:linear-gradient(180deg,#1D3E8A 0,#2F6FD6 100%);color:#fff;padding:4px 14px 14px}
.gm .b-bmw small{display:block;font-size:10px;opacity:.85}
.gm .b-bmw>b{display:block;font-size:26px;font-weight:700;line-height:1.1;margin:4px 0 3px}
.gm .b-bmw>b small{display:inline;font-size:12px;font-weight:500;opacity:1}
.gm .sk-bmw .m-sect{text-transform:uppercase;letter-spacing:.06em;font-size:10px}
.gm .sk-bmw .m-btn{background:#1A1A1A;color:#fff;text-transform:uppercase;letter-spacing:.06em;font-size:11.5px}
/* GWM (ORA) */
.gm .sk-gwm .scr{background:linear-gradient(180deg,#D9F1EA 0,#EEF6F4 40%)}
.gm .xo{margin:-6px calc(-1*var(--px)) 0;padding:0 12px;flex:none}
.gm .xo-hd{display:flex;align-items:center;justify-content:space-between;height:28px}
.gm .xo-hd b{display:flex;align-items:center;gap:4px;font-size:14px;font-weight:700;white-space:nowrap;min-width:0}
.gm .xo-hd .xo-dn{transform:rotate(90deg);width:12px;height:12px}
.gm .xo-hd svg{width:16px;height:16px}
.gm .xo-rg{position:relative;border-radius:10px;padding:4px 6px;margin:0 -6px}
.gm .xo-rg b{font-size:28px;font-weight:700;line-height:1}
.gm .xo-rg b small{font-size:10px;font-weight:500;color:#6F7A78;margin-left:4px}
.gm .xo-bar{display:block;position:relative;height:5px;border-radius:3px;background:#D3E4E0;margin:6px 0 4px;width:70%}
.gm .xo-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:#16B08F}
.gm .xo-cp{display:flex;align-items:center;gap:4px;font-size:10px;color:#0E8C71;font-weight:600}
.gm .xo-cp svg{width:12px;height:12px}
.gm .xo-img{height:96px;color:#1A1A1A}
.gm .xo-qc{flex:none;background:#fff;border-radius:14px;padding:10px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.gm .xo-qc>b{display:block;font-size:11.5px;font-weight:700;margin-bottom:8px}
.gm .xo-qc>div{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}
.gm .xo-qc span{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:9px;color:#4B5553;min-width:0}
.gm .xo-qc i{width:32px;height:32px;border-radius:10px;background:#EEF6F4;display:flex;align-items:center;justify-content:center;color:#1A1A1A}
.gm .xo-qc i svg{width:16px;height:16px}
.gm .xo-g{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:none}
.gm .xo-g div{background:#fff;border-radius:14px;padding:10px}
.gm .xo-g small{display:block;font-size:9.5px;color:#6F7A78}
.gm .xo-g b{display:block;font-size:15px;font-weight:700;margin-top:3px}
.gm .b-gwm{text-align:center}
.gm .b-gwm .bg-t{display:block;font-size:10px;color:#6F7A78}
.gm .bg-r{position:relative;height:118px;margin-top:4px}
.gm .bg-img{position:absolute;inset:14px 0 0;opacity:.35;color:#1A1A1A}
.gm .bg-r .m-rg{position:absolute;left:50%;top:0;transform:translateX(-50%);width:92px;height:92px}
.gm .bg-st{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:#fff;border-radius:12px;padding:8px 4px}
.gm .bg-st b{display:block;font-size:12px;font-weight:700}
.gm .bg-st small{display:block;font-size:8.5px;color:#6F7A78;margin-top:1px}
/* Honda */
.gm .sk-honda .scr{background:linear-gradient(180deg,#3A0E16 0,#1A0B0E 45%,#0E0B0C 100%)}
.gm .sk-honda .m-top{background:transparent}
.gm .sk-honda .m-tabs{background:transparent;border-top-color:rgba(255,255,255,.08)}
.gm .sk-honda .m-nav b{letter-spacing:.02em}
.gm .xh{margin:-6px calc(-1*var(--px)) 0;padding:0 12px;flex:none;color:#fff}
.gm .xh-hd{display:flex;align-items:center;justify-content:space-between;height:32px}
.gm .xh-hd b{font-size:19px;font-weight:600;letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.gm .xh-hd span{display:flex;gap:10px}
.gm .xh-hd svg{width:16px;height:16px}
.gm .xh>small{display:flex;align-items:center;gap:4px;font-size:9px;color:#CFC6C7;margin-top:2px}
.gm .xh>small svg{width:10px;height:10px}
.gm .xh-k{display:grid;grid-template-columns:auto 1fr auto;align-items:end;gap:10px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.12)}
.gm .xh-bt{display:block;position:relative;width:52px;height:18px;border:1.5px solid #fff;border-radius:3px;padding:2px}
.gm .xh-bt i{display:block;height:100%;background:#58C433;border-radius:1px}
.gm .xh-k small{display:block;font-size:8.5px;color:#CFC6C7}
.gm .xh-k b{display:block;font-size:14px;font-weight:600}
.gm .xh-st{display:grid;grid-template-columns:1fr 112px 1fr;align-items:center;gap:4px;margin-top:12px}
.gm .xh-st>span{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:8.5px;color:#E6DEDF;text-align:center}
.gm .xh-st>span svg{width:17px;height:17px}
.gm .xh-ring{width:112px;height:112px;border-radius:50%;background:radial-gradient(circle at 50% 45%,#7A1222 0,#3E0A13 70%);border:1px solid rgba(228,0,43,.55);display:flex;align-items:center;justify-content:center;overflow:hidden}
.gm .xh-img{width:96px;height:64px;color:#fff}
.gm .xh-loc{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:8.5px;color:#E6DEDF;margin-top:6px}
.gm .xh-loc svg{width:15px;height:15px}
.gm .xh-b{display:flex;justify-content:space-around;margin-top:8px}
.gm .xh-b span{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:9px;color:#E6DEDF}
.gm .xh-b i{width:40px;height:40px;border-radius:50%;background:#fff;color:#E4002B;display:flex;align-items:center;justify-content:center}
.gm .xh-b i svg{width:18px;height:18px}
.gm .sk-honda .m-tabs>span.on{box-shadow:inset 0 -2px 0 #E4002B}
.gm .sk-honda .m-btn{background:#E4002B;color:#fff;border-radius:3px}
/* --- Lote 4: Porsche, Renault, SEAT, Audi, Citroën, DS, Hyundai, Mazda --- */
.gm .xpo-img,.gm .xse-img,.gm .xad-img,.gm .xci-img,.gm .xds-img,.gm .xhy-img,.gm .xmz-img,.gm .bse-img{display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}
.gm .xpo-img img,.gm .xse-img img,.gm .xad-img img,.gm .xci-img img,.gm .xds-img img,.gm .xhy-img img,.gm .xmz-img img,.gm .bse-img img{display:block;width:100%;height:100%;object-fit:cover}
.gm .xpo-img>svg,.gm .xse-img>svg,.gm .xad-img>svg,.gm .xci-img>svg,.gm .xds-img>svg,.gm .xhy-img>svg,.gm .xmz-img>svg,.gm .bse-img>svg{width:140px;color:currentColor;opacity:.55}
.gm .xpo svg,.gm .xpo-bt svg,.gm .xpo-cl svg,.gm .xse svg,.gm .xse-g svg,.gm .xad svg,.gm .xad-g svg,.gm .xci svg,.gm .xci-r svg,.gm .xds svg,.gm .xds-r svg,.gm .xhy svg,.gm .xhy-s svg,.gm .xhy-w svg,.gm .xmz svg,.gm .xmz-r svg,.gm .xmz-n svg,.gm .b-por svg,.gm .b-seat svg,.gm .b-audi svg,.gm .b-stl svg{stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
/* Porsche */
.gm .xpo{margin:-6px calc(-1*var(--px)) 0;padding:2px 12px 0;flex:none;background:linear-gradient(180deg,#000 0,var(--bg) 100%)}
.gm .xpo-up{display:block;font-size:9px;color:var(--mut)}
.gm .xpo-nm{display:flex;align-items:center;gap:4px;font-size:18px;font-weight:600;margin-top:2px}
.gm .xpo-nm svg{width:13px;height:13px;transform:rotate(90deg)}
.gm .xpo-ch{display:inline-flex;align-items:center;gap:5px;margin-top:6px;padding:4px 8px;border-radius:4px;background:#26272B;font-size:9.5px}
.gm .xpo-ch svg{width:11px;height:11px;color:#2E9A5B}
.gm .xpo-img{height:92px;color:#fff;margin-top:2px}
.gm .xpo-q{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding-bottom:2px}
.gm .xpo-q i{height:36px;border-radius:6px;background:#1E1F23;display:flex;align-items:center;justify-content:center}
.gm .xpo-q svg{width:16px;height:16px}
.gm .xpo-bt{position:relative;flex:none;overflow:hidden;border-radius:6px;background:#1C1D20;padding:10px 46px 10px 10px;min-height:66px}
.gm .xpo-fill{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(46,154,91,0) 55%,rgba(46,154,91,.9) 100%);border-right:2px solid #3DBE72}
.gm .xpo-bt>div{position:relative}
.gm .xpo-bt b{display:block;font-size:12px;font-weight:600}
.gm .xpo-bt small{display:block;font-size:9px;color:var(--mut);margin-top:1px}
.gm .xpo-bt p{margin:8px 0 0;font-size:10px;color:var(--mut)}
.gm .xpo-bt p em{font-style:normal;font-size:17px;font-weight:600;color:var(--fg)}
.gm .xpo-bt>i{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:30px;height:30px;border-radius:6px;background:#2A2B2F;display:flex;align-items:center;justify-content:center}
.gm .xpo-bt>i svg{width:15px;height:15px}
.gm .xpo-cl{flex:none;display:flex;align-items:center;justify-content:space-between;border-radius:6px;background:#1C1D20;padding:10px}
.gm .xpo-cl b{display:block;font-size:12px;font-weight:600}
.gm .xpo-cl small{display:block;font-size:9px;color:var(--mut);margin-top:3px}
.gm .xpo-cl small em{font-style:normal;font-size:14px;color:var(--fg);font-weight:600;margin-right:4px}
.gm .xpo-tg{width:30px;height:17px;border-radius:9px;background:#3A3B40;position:relative;flex:none}
.gm .xpo-tg:after{content:"";position:absolute;left:2px;top:2px;width:13px;height:13px;border-radius:50%;background:#fff}
.gm .b-por{background:#1C1D20;border-radius:6px;padding:10px}
.gm .bp-dep{text-align:center}
.gm .bp-dep small{display:block;font-size:9px;color:var(--mut)}
.gm .bp-dep b{display:block;font-size:17px;font-weight:600;line-height:1.15}
.gm .bp-v{display:grid;grid-template-columns:1fr 64px 1fr;align-items:center;gap:8px;margin-top:8px}
.gm .bp-v>b{font-size:15px;font-weight:600;text-align:right}
.gm .bp-v>b:last-child{text-align:left}
.gm .bp-v>b small{display:block;font-size:9px;color:var(--mut);font-weight:400}
.gm .bp-tank{position:relative;height:84px;border-radius:4px;background-color:#26272B;background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.07) 0 3px,transparent 3px 7px);overflow:hidden}
.gm .bp-tank i{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(180deg,#2E9A5B,#1E6E3F)}
.gm .bp-tank em{position:absolute;left:0;right:0;height:2px;background:#fff}
.gm .bp-kw{display:flex;align-items:center;justify-content:center;gap:4px;margin-top:8px;font-size:9.5px;color:#4CD083}
.gm .bp-kw svg{width:11px;height:11px}
.gm .sk-porsche .m-btn{background:#2A2B2F;color:#fff;border-radius:6px}
/* Renault (mesma plataforma da Alpine e da Dacia) */
.gm .sk-renault .xa-hd b{font-size:15px;text-transform:uppercase;letter-spacing:.04em}
.gm .sk-renault .xa-bar i{background:#3D7BF7}
.gm .sk-renault .xa-rg b{font-size:30px}
.gm .sk-renault .xa-q span{border-radius:4px}
.gm .sk-renault .xa-q svg{color:#fff}
.gm .sk-renault .xa-r>i{background:#EFDF00;color:#000}
.gm .sk-renault .xa-sec{color:#fff;letter-spacing:.06em}
.gm .sk-renault .m-btn{border-radius:4px;text-transform:uppercase;letter-spacing:.04em}
/* SEAT */
.gm .xse{margin:-6px calc(-1*var(--px)) 0;padding:0 12px;flex:none;text-align:center}
.gm .xse-hd{display:flex;align-items:center;justify-content:space-between;height:28px}
.gm .xse-hd b{display:flex;align-items:center;gap:3px;white-space:nowrap;font-size:11px;font-weight:700;letter-spacing:.02em;text-transform:uppercase}
.gm .xse-hd b svg{width:11px;height:11px;transform:rotate(90deg)}
.gm .xse-hd>span{position:relative;display:flex}
.gm .xse-hd>span svg,.gm .xse-hd>svg{width:16px;height:16px}
.gm .xse-hd>span i{position:absolute;right:0;top:0;width:5px;height:5px;border-radius:50%;background:#E2231A}
.gm .xse-up{display:flex;align-items:center;justify-content:center;gap:3px;font-size:8.5px;color:var(--mut)}
.gm .xse-up svg{width:9px;height:9px}
.gm .xse-km{display:flex;justify-content:center;gap:4px;align-items:center;font-size:10px;color:var(--mut);margin-top:3px}
.gm .xse-km b{font-size:17px;color:var(--fg)}
.gm .xse-km svg{width:13px;height:13px;color:var(--fg)}
.gm .xse-img{height:76px;color:#1A1A1A}
.gm .xse-st{display:inline-flex;align-items:center;gap:4px;font-size:9.5px;padding:3px 9px;border-radius:999px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.gm .xse-st svg{width:10px;height:10px;color:#138C82}
.gm .xse-q{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:6px;margin-top:8px}
.gm .xse-q>span{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:8.5px;color:#444}
.gm .xse-q i{display:flex;align-items:center;justify-content:center;gap:10px;height:30px;width:100%;border-radius:8px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.gm .xse-q .lk i{border-bottom:2px solid #F2B807}
.gm .xse-q svg{width:14px;height:14px}
.gm .xse-g{flex:none;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.gm .xse-c{position:relative;background:#fff;border-radius:10px;padding:9px;box-shadow:0 1px 3px rgba(0,0,0,.08);min-width:0}
.gm .xse-c>b{display:block;font-size:11px;font-weight:700}
.gm .xse-c>small{display:block;font-size:9px;color:var(--mut)}
.gm .xse-c p{margin:5px 0 0;font-size:16px;font-weight:700;color:#138C82}
.gm .xse-c p small{font-size:10px;font-weight:500}
.gm .xse-c p.xse-t{color:var(--fg)}
.gm .xse-hex{display:block;height:16px;border-radius:4px;background:#E7ECEB;margin-top:5px;overflow:hidden}
.gm .xse-hex i,.gm .bse-fill{display:block;height:100%;background-color:#138C82;background-image:repeating-linear-gradient(60deg,rgba(255,255,255,.16) 0 1.5px,transparent 1.5px 6px),repeating-linear-gradient(-60deg,rgba(255,255,255,.16) 0 1.5px,transparent 1.5px 6px)}
.gm .xse-c>svg{position:absolute;right:8px;bottom:8px;width:20px;height:20px;padding:3px;border-radius:50%;background:#555;color:#fff}
.gm .b-seat{border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.gm .bse-v{position:relative;height:84px;background:#E7ECEB}
.gm .bse-fill{position:absolute;left:0;top:0;bottom:0}
.gm .bse-t{position:absolute;left:10px;top:9px;color:#fff}
.gm .bse-t b{display:block;font-size:20px;font-weight:700;line-height:1}
.gm .bse-t small{font-size:10px}
.gm .bse-img{position:absolute;right:4px;bottom:2px;width:120px;height:62px;color:#1A1A1A}
.gm .bse-st{display:grid;grid-template-columns:repeat(3,1fr);padding:8px 6px}
.gm .bse-st div{text-align:center}
.gm .bse-st small{display:block;font-size:8.5px;color:var(--mut)}
.gm .bse-st b{font-size:11px}
.gm .sk-seat .m-tabs{margin:0 10px 14px;padding:5px 4px;border:0;border-radius:16px;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.12)}
.gm .sk-seat .m-tabs>span.on i{background:#F0F0F0;color:#C8102E}
.gm .sk-seat .m-tabs>span.on em{color:#C8102E}
.gm .sk-seat .m-btn{background:transparent;color:var(--fg);border:1.5px solid var(--fg)}
/* Audi */
.gm .xad{margin:-6px calc(-1*var(--px)) 0;padding:0 12px;flex:none}
.gm .xad-hd{display:flex;align-items:flex-start;justify-content:space-between;padding-top:2px}
.gm .xad-hd b{display:block;font-size:15px;font-weight:400}
.gm .xad-hd small{display:flex;align-items:center;gap:3px;font-size:8.5px;color:var(--mut);margin-top:2px}
.gm .xad-hd small svg{width:9px;height:9px}
.gm .xad-av{width:24px;height:24px;border-radius:50%;background:#3A404B;display:flex;align-items:center;justify-content:center}
.gm .xad-av svg{width:13px;height:13px}
.gm .xad-img{height:84px;color:#fff}
.gm .xad-k{display:flex;align-items:flex-end;justify-content:space-between}
.gm .xad-k b{font-size:30px;font-weight:300;line-height:1}
.gm .xad-k b small{font-size:11px}
.gm .xad-k span{font-size:10px;color:var(--mut)}
.gm .xad-bar,.gm .ba-bar{position:relative;display:block;height:3px;border-radius:2px;background:#3A404B;margin-top:6px}
.gm .xad-bar i,.gm .ba-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:#5BE37D;box-shadow:0 0 8px rgba(91,227,125,.8)}
.gm .ba-bar em{position:absolute;top:-3px;width:2px;height:9px;background:#fff}
.gm .xad-sub{display:block;font-size:9px;color:var(--mut);margin-top:4px}
.gm .xad-g{flex:none;display:grid;grid-template-columns:1fr 1fr;gap:6px}
.gm .xad-g>div{position:relative;background:#2A2F38;border-radius:6px;padding:9px;min-height:38px;font-size:10px;min-width:0}
.gm .xad-g>div.on{background:#3A414C}
.gm .xad-g>div>svg{position:absolute;right:8px;top:9px;width:13px;height:13px}
.gm .xad-g b{display:block;font-size:15px;font-weight:300;margin-top:6px}
.gm .xad-g small{display:flex;align-items:center;gap:4px;font-size:8.5px;color:var(--mut)}
.gm .xad-g small i{width:5px;height:5px;border-radius:50%;background:#5BE37D}
.gm .xad-ch{grid-row:span 2}
.gm .b-audi{padding:4px 0}
.gm .ba-k{display:flex;align-items:flex-end;justify-content:space-between}
.gm .ba-k b{font-size:28px;font-weight:300;line-height:1}
.gm .ba-k b small{font-size:11px}
.gm .ba-k span{font-size:11px;color:var(--mut)}
.gm .b-audi>small{display:block;font-size:9px;color:var(--mut);margin-top:6px}
.gm .sk-audi .m-tabs{margin:0 14px 14px;padding:4px;border:0;border-radius:14px;background:#0B0D11}
.gm .sk-audi .m-tabs i{width:34px;height:26px;border-radius:10px}
.gm .sk-audi .m-tabs>span.on i{background:#3A404B}
.gm .sk-audi .m-btn{border-radius:6px}
/* Citroën e DS: ecrã de carregamento (barras verticais) */
.gm .b-stl{padding:2px 0}
.gm .bq-up{display:block;font-size:9px;color:var(--mut);text-align:center}
.gm .bq-k{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:6px;text-align:center}
.gm .bq-k small{display:block;font-size:7.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--mut)}
.gm .bq-k b{display:block;font-size:10.5px;margin-top:2px;color:#12A4B4}
.gm .bq-m{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:8px}
.gm .bq-m>b{font-size:20px;font-weight:700;line-height:1;color:#12A4B4;min-width:44px}
.gm .bq-m>b:last-child{font-size:12px;text-align:right;color:var(--fg)}
.gm .bq-bars{flex:1;display:flex;align-items:flex-end;gap:3px;height:52px}
.gm .bq-bars i{flex:1;height:100%;border-radius:2px;background:var(--line)}
.gm .bq-bars i.on{background:#12A4B4}
.gm .sk-ds .bq-k b,.gm .sk-ds .bq-m>b:first-child{color:var(--acct)}
.gm .sk-ds .bq-bars i.on{background:linear-gradient(180deg,var(--acct),var(--acc));box-shadow:0 0 6px var(--hls,rgba(63,208,212,.6))}
.gm .sk-ds .bq-bars i{background:var(--line)}
/* Citroën */
.gm .xci{margin:-6px calc(-1*var(--px)) 0;flex:none;background:#fff}
.gm .xci-hd{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:2px 12px 6px}
.gm .xci-hd b{display:flex;align-items:center;gap:3px;font-size:11px;font-weight:700;color:#DA291C;text-transform:uppercase;line-height:1.15;min-width:0}
.gm .xci-hd b svg{width:11px;height:11px;transform:rotate(90deg);color:#1D1D1B;flex:none}
.gm .xci-hd>svg{width:16px;height:16px;flex:none}
.gm .xci-tb{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #E3E3E3}
.gm .xci-tb i{display:flex;justify-content:center;padding:5px 0 6px;color:#1D1D1B}
.gm .xci-tb i.on{color:#DA291C;box-shadow:inset 0 -2px 0 #DA291C}
.gm .xci-tb svg{width:15px;height:15px}
.gm .xci-hero{position:relative;height:84px;margin:6px 12px 0}
.gm .xci-my{position:absolute;left:0;top:0;font-size:62px;line-height:1;font-weight:800;color:#5B7490;letter-spacing:-.02em}
.gm .xci-img{position:absolute;right:0;bottom:0;width:150px;height:72px;color:#1D1D1B}
.gm .xci-st{display:block;text-align:center;font-size:9.5px;color:#555;margin-top:4px}
.gm .xci-q{display:flex;justify-content:center;gap:14px;margin:6px 0 4px}
.gm .xci-q i{width:30px;height:30px;border-radius:50%;background:#EEF0F2;display:flex;align-items:center;justify-content:center;color:#5B7490}
.gm .xci-q svg{width:15px;height:15px}
.gm .xci-r{position:relative;flex:none;display:flex;align-items:center;gap:10px;padding:7px 2px;border-bottom:1px solid #E3E3E3}
.gm .xci-r>svg:first-child{width:18px;height:18px;color:#5B7490}
.gm .xci-r span{flex:1;font-size:11.5px;font-weight:700;color:#5B7490}
.gm .xci-r small{display:block;font-size:9.5px;font-weight:400;color:#1D1D1B}
.gm .xci-r>svg:last-child{width:13px;height:13px;color:#DA291C}
.gm .xci-nw{flex:none;margin:auto calc(-1*var(--px)) -12px;padding:9px 12px;background:#5B7490;color:#fff;font-size:10px;font-weight:700;letter-spacing:.06em;text-align:center;position:relative}
.gm .xci-nw em{position:absolute;right:14px;top:8px;font-style:normal;font-size:8px;min-width:14px;height:14px;border-radius:7px;background:#DA291C;display:flex;align-items:center;justify-content:center}
.gm .sk-citroen .m-nav b{color:#1D1D1B;text-transform:uppercase;font-size:13px}
.gm .sk-citroen .m-back{color:#DA291C}
/* DS */
.gm .xds{margin:-6px calc(-1*var(--px)) 0;flex:none;background:linear-gradient(180deg,#2E2724 0,var(--bg) 100%)}
.gm .xds-hd{display:flex;align-items:center;justify-content:space-between;padding:2px 12px 6px}
.gm .xds-hd b{display:flex;align-items:center;gap:3px;white-space:nowrap;min-width:0;font:400 15px/1.1 var(--hf)}
.gm .xds-hd b svg{width:11px;height:11px;transform:rotate(90deg)}
.gm .xds-hd>svg{width:16px;height:16px}
.gm .xds-tb{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #3A3330}
.gm .xds-tb i{display:flex;justify-content:center;padding:5px 0 6px;color:#A39E94}
.gm .xds-tb i.on{color:#fff;box-shadow:inset 0 -2px 0 #fff}
.gm .xds-tb svg{width:15px;height:15px}
.gm .xds-img{height:92px;color:#F3EFE7;margin:4px 12px 0}
.gm .xds-st{display:block;text-align:center;font-size:9.5px;color:#A39E94;letter-spacing:.06em;text-transform:uppercase}
.gm .xds-q{display:flex;justify-content:center;gap:14px;margin:8px 0 6px}
.gm .xds-q i{width:30px;height:30px;border-radius:50%;border:1px solid #5A514C;display:flex;align-items:center;justify-content:center}
.gm .xds-q svg{width:14px;height:14px}
.gm .xds-r{position:relative;flex:none;display:flex;align-items:center;gap:10px;padding:8px 2px;border-bottom:1px solid #3A3330}
.gm .xds-r>svg:first-child{width:17px;height:17px;color:#B5004A}
.gm .xds-r span{flex:1;font-size:11px;letter-spacing:.06em;text-transform:uppercase}
.gm .xds-r small{display:block;font-size:9.5px;letter-spacing:0;text-transform:none;color:#A39E94;margin-top:1px}
.gm .xds-r>svg:last-child{width:13px;height:13px;color:#A39E94}
.gm .sk-ds .m-btn{background:var(--acct);color:var(--on);border:0;text-transform:uppercase;letter-spacing:.06em}
/* Hyundai */
.gm .xhy{margin:-6px calc(-1*var(--px)) 0;padding:0 12px 10px;flex:none;background:linear-gradient(180deg,#CFE0F2 0,#E6EEF7 70%,var(--bg) 100%)}
.gm .xhy-hd{display:flex;align-items:center;justify-content:space-between;height:28px}
.gm .xhy-hd b{font-size:16px;font-weight:700;color:#002C5F}
.gm .xhy-hd span{display:flex;gap:10px}
.gm .xhy-hd svg{width:16px;height:16px;color:#002C5F}
.gm .xhy-k b{display:block;font-size:24px;font-weight:700;color:#002C5F;line-height:1}
.gm .xhy-bar{display:block;width:110px;height:5px;border-radius:3px;background:#fff;margin:6px 0 4px;overflow:hidden}
.gm .xhy-bar i{display:block;height:100%;background:#002C5F;border-radius:3px}
.gm .xhy-k small{font-size:9.5px;color:#4B5C74}
.gm .xhy-img{height:80px;color:#0B1F3A}
.gm .xhy-q{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}
.gm .xhy-q span{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:8.5px;color:#0B1F3A;min-width:0;border-radius:8px;padding:2px 0}
.gm .xhy-q i{width:32px;height:32px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;color:#002C5F;box-shadow:0 1px 3px rgba(0,44,95,.12)}
.gm .xhy-q svg{width:15px;height:15px}
.gm .xhy-s{flex:none;display:flex;align-items:center;gap:6px;background:#fff;border-radius:999px;padding:4px 4px 4px 12px;font-size:10px;color:var(--mut);box-shadow:0 1px 3px rgba(0,44,95,.1)}
.gm .xhy-s span{flex:1}
.gm .xhy-s i{width:24px;height:24px;border-radius:50%;background:#002C5F;color:#fff;display:flex;align-items:center;justify-content:center}
.gm .xhy-s svg{width:12px;height:12px}
.gm .xhy-w{flex:none;display:flex;align-items:center;gap:8px;background:#fff;border-radius:12px;padding:9px 12px;box-shadow:0 1px 3px rgba(0,44,95,.1)}
.gm .xhy-w svg{width:18px;height:18px;color:#F2A900}
.gm .xhy-w b{font-size:15px;color:#0B1F3A}
.gm .xhy-w small{font-size:9.5px;color:var(--mut)}
.gm .sk-hyundai .m-btn{background:#002C5F}
/* Mazda */
.gm .xmz{margin:-6px calc(-1*var(--px)) 0;flex:none}
.gm .xmz-img{height:110px;color:#fff;background:radial-gradient(ellipse at 50% 70%,#3A3A3A 0,#0A0A0A 75%)}
.gm .xmz-in{padding:8px 12px 0}
.gm .xmz-in>b{display:block;font-size:14px;font-weight:300;letter-spacing:.14em;text-transform:uppercase}
.gm .xmz-k{display:flex;align-items:center;gap:6px;margin-top:6px;font-size:10px;letter-spacing:.04em}
.gm .xmz-k svg{width:12px;height:12px}
.gm .xmz-bar{flex:1;height:3px;background:#333;position:relative}
.gm .xmz-bar i{position:absolute;left:0;top:0;bottom:0;background:#8FB4E8}
.gm .xmz-q{display:grid;grid-template-columns:repeat(4,1fr);margin-top:10px;border-top:1px solid #262626;border-bottom:1px solid #262626}
.gm .xmz-q i{display:flex;justify-content:center;padding:8px 0}
.gm .xmz-q i+i{border-left:1px solid #262626}
.gm .xmz-q svg{width:15px;height:15px}
.gm .xmz-r{position:relative;flex:none;display:flex;align-items:center;gap:8px;padding:8px 2px;border-bottom:1px solid #262626}
.gm .xmz-r>svg:first-child{width:14px;height:14px}
.gm .xmz-r span{flex:1;font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.gm .xmz-r small{display:block;font-size:9px;letter-spacing:.02em;text-transform:none;color:var(--mut);margin-top:1px}
.gm .xmz-r>svg:last-child{width:12px;height:12px;color:var(--mut)}
.gm .xmz-sec{flex:none;font-size:9px;letter-spacing:.14em;color:var(--mut);margin-top:2px}
.gm .xmz-n{flex:none;display:flex;align-items:center;gap:6px;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:6px 0;border-bottom:1px solid #262626}
.gm .xmz-n svg{width:13px;height:13px;color:#C8102E}
.gm .xmz-n span{flex:1}
.gm .xmz-n em{font-style:normal;letter-spacing:0;text-transform:none;color:var(--mut)}
.gm .sk-mazda .m-nav b{font-weight:300;letter-spacing:.12em;text-transform:uppercase;font-size:12px}
.gm .sk-mazda .m-btn{background:transparent;color:#fff;border:1px solid #fff;letter-spacing:.12em;text-transform:uppercase;font-weight:400}
/* --- Lote 5: Nissan, Opel, Peugeot, Škoda, Toyota, Polestar, smart, Tesla --- */
.gm .xns-img,.gm .xop-img,.gm .xpe-img,.gm .xsk-img,.gm .xty-img,.gm .xps-img,.gm .xsm-img,.gm .xte-img{display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}
.gm .xns-img img,.gm .xop-img img,.gm .xpe-img img,.gm .xsk-img img,.gm .xty-img img,.gm .xps-img img,.gm .xsm-img img,.gm .xte-img img{display:block;width:100%;height:100%;object-fit:cover}
.gm .xns-img>svg,.gm .xop-img>svg,.gm .xpe-img>svg,.gm .xsk-img>svg,.gm .xty-img>svg,.gm .xps-img>svg,.gm .xsm-img>svg,.gm .xte-img>svg{width:140px;color:currentColor;opacity:.55}
.gm .xns svg,.gm .xns-c svg,.gm .xop svg,.gm .xop-b svg,.gm .xpe svg,.gm .xpe-b svg,.gm .xsk svg,.gm .xsk-c svg,.gm .xty svg,.gm .xty-c svg,.gm .xps svg,.gm .xps-g svg,.gm .xsm svg,.gm .xsm-c svg,.gm .xte svg,.gm .xte-r svg,.gm .b-nis svg,.gm .b-sko svg,.gm .b-toy svg,.gm .b-pol svg,.gm .b-sma svg{stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
/* Nissan */
.gm .xns{margin:-6px calc(-1*var(--px)) 0;padding:4px 12px 0;flex:none;text-align:center}
.gm .xns-nm{display:inline-flex;align-items:center;gap:4px;font-size:15px;font-weight:300;letter-spacing:.12em;text-transform:uppercase;color:#1A1A1A}
.gm .xns-nm svg{width:12px;height:12px;transform:rotate(90deg)}
.gm .xns-img{height:96px;margin-top:4px;color:#1A1A1A}
.gm .xns-rg{display:block;font-size:9.5px;color:#6B7280;margin-top:2px}
.gm .xns-rg b{color:#1A1A1A;font-weight:600}
.gm .xns-q{display:flex;justify-content:center;gap:16px;margin:8px 0 2px}
.gm .xns-q i{width:30px;height:30px;border-radius:50%;border:1px solid #9AA3AF;display:flex;align-items:center;justify-content:center;color:#1A1A1A}
.gm .xns-q svg{width:14px;height:14px}
.gm .xns-c{position:relative;flex:none;display:flex;align-items:center;gap:10px;background:#fff;border-radius:6px;padding:9px 10px;box-shadow:0 1px 2px rgba(17,24,39,.06)}
.gm .xns-c>svg:first-child{width:17px;height:17px;color:#1F6FC5;flex:none}
.gm .xns-c span{flex:1;min-width:0;font-size:11px;font-weight:600;color:#1A1A1A}
.gm .xns-c small{display:block;font-size:9.5px;font-weight:400;color:#6B7280;margin-top:1px}
.gm .xns-c em{font-style:normal;font-size:13px;font-weight:600;color:#1F6FC5}
.gm .xns-c>svg:last-child{width:12px;height:12px;color:#9AA3AF;flex:none}
.gm .b-nis{background:#fff;border-radius:6px;padding:10px 12px 9px;box-shadow:0 1px 2px rgba(17,24,39,.06)}
.gm .bns-h{display:flex;justify-content:space-between;align-items:baseline;font-size:10.5px;color:#4B5563}
.gm .bns-h b{font-size:20px;font-weight:500;color:#1F6FC5}
.gm .bns-l{display:block;position:relative;height:3px;background:#E5E7EB;border-radius:2px;margin-top:10px}
.gm .bns-l i{position:absolute;left:0;top:0;bottom:0;background:#1F6FC5;border-radius:2px}
.gm .bns-t{display:flex;justify-content:space-between;margin-top:4px}
.gm .bns-t small{font-size:8px;color:#9AA3AF}
.gm .bns-r{display:flex;justify-content:space-between;align-items:baseline;margin-top:8px;padding-top:8px;border-top:1px solid #EEF0F3;font-size:9.5px;color:#4B5563}
.gm .bns-r b{font-size:15px;font-weight:500;color:#1F6FC5}
.gm .bns-p{display:block;margin-top:8px;padding:6px 8px;border-radius:999px;background:#E5E7EB;color:#4B5563;font-size:9.5px;text-align:center}
.gm .bns-u{display:flex;justify-content:space-between;margin-top:7px;font-size:8.5px;color:#9AA3AF}
/* Opel (MyOpel) */
.gm .sk-opel .m-top{background:#000;color:#fff}
.gm .sk-opel .m-back{color:#fff}
.gm .xop{margin:-6px calc(-1*var(--px)) 0;flex:none;background:#fff}
.gm .xop-hd{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:4px 12px 6px;background:#000;color:#fff}
.gm .xop-hd b{display:flex;align-items:center;gap:4px;font-size:10.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;min-width:0}
.gm .xop-hd b em{font-style:normal;color:#F7E400;overflow:hidden;text-overflow:ellipsis}
.gm .xop-hd b svg{width:10px;height:10px;transform:rotate(90deg);flex:none}
.gm .xop-hd span{display:flex;gap:10px;flex:none}
.gm .xop-hd span svg{width:15px;height:15px}
.gm .xop-tb{display:grid;grid-template-columns:repeat(4,1fr);background:#000;border-top:1px solid #222}
.gm .xop-tb i{display:flex;justify-content:center;padding:6px 0 7px;color:#fff}
.gm .xop-tb i.on{color:#F7E400;box-shadow:inset 0 -3px 0 #F7E400}
.gm .xop-tb svg{width:15px;height:15px}
.gm .xop-img{height:82px;margin:8px 12px 0;color:#1A1A1A}
.gm .xop-k{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px 12px 10px;text-align:center}
.gm .xop-k small{display:block;font-size:7px;line-height:1.2;letter-spacing:.04em;text-transform:uppercase;color:#666;min-height:17px}
.gm .xop-k b{display:block;font-size:11.5px;font-weight:700;color:#000;margin-top:2px}
.gm .xop-sg{display:flex;gap:2px;justify-content:center;margin-top:3px}
.gm .xop-sg i{width:9px;height:5px;background:#D6D6D6}
.gm .xop-sg i.on{background:#000}
.gm .xop-b{flex:none;display:grid;grid-template-columns:1fr 1fr;gap:4px}
.gm .xop-b>div{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:52px;padding:6px;background:#F7E400;color:#000;font-size:8.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;text-align:center;line-height:1.15}
.gm .xop-b svg{width:15px;height:15px}
.gm .xop-map{flex:none;height:62px;margin:0 calc(-1*var(--px));background-color:#E8EEF2;background-image:linear-gradient(115deg,transparent 46%,#fff 46%,#fff 50%,transparent 50%),linear-gradient(20deg,transparent 60%,#fff 60%,#fff 63%,transparent 63%);position:relative}
.gm .xop-map i{position:absolute;left:46%;top:22px;width:12px;height:12px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#000}
.gm .xop-nw{flex:none;margin:auto calc(-1*var(--px)) -12px;padding:9px 12px;background:#000;color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.08em;text-align:center}
.gm .sk-opel .b-stl{background:#000;color:#fff;border-radius:2px;padding:9px 10px}
.gm .sk-opel .bq-k b,.gm .sk-opel .bq-m>b:first-child{color:#F7E400}
.gm .sk-opel .bq-m>b:last-child{color:#fff}
.gm .sk-opel .bq-bars i{background:#2E2E2E}
.gm .sk-opel .bq-bars i.on{background:#F7E400}
.gm .sk-opel .m-btn{background:#F7E400;color:#000;text-transform:uppercase;letter-spacing:.06em}
/* Peugeot (MyPeugeot) */
.gm .sk-peugeot .m-top{background:#0F2B4A;color:#fff}
.gm .sk-peugeot .m-back{color:#fff}
.gm .xpe{margin:-6px calc(-1*var(--px)) 0;flex:none;background:#fff}
.gm .xpe-hd{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:4px 12px 6px;background:#0F2B4A;color:#fff}
.gm .xpe-hd b{display:flex;align-items:center;gap:4px;font-size:10.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;min-width:0}
.gm .xpe-hd b em{font-style:normal;color:#4FA3F7;overflow:hidden;text-overflow:ellipsis}
.gm .xpe-hd b svg{width:10px;height:10px;transform:rotate(90deg);flex:none}
.gm .xpe-hd span{display:flex;gap:10px;flex:none}
.gm .xpe-hd span svg{width:15px;height:15px}
.gm .xpe-tb{display:grid;grid-template-columns:repeat(4,1fr);background:#0F2B4A}
.gm .xpe-tb i{display:flex;justify-content:center;padding:6px 0 7px;color:#fff}
.gm .xpe-tb i.on{box-shadow:inset 0 -3px 0 #1E88E5}
.gm .xpe-tb svg{width:15px;height:15px}
.gm .xpe-up{display:block;text-align:center;font-size:8px;color:#9AA6B2;padding:6px 12px 0}
.gm .xpe-img{height:80px;margin:4px 12px 0;color:#0F2B4A}
.gm .xpe-k{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px 12px 10px;text-align:center}
.gm .xpe-k small{display:block;font-size:7px;line-height:1.2;letter-spacing:.04em;text-transform:uppercase;color:#6B7A8C;min-height:17px}
.gm .xpe-k b{display:block;font-size:12px;font-weight:400;color:#6E8BA8;margin-top:2px}
.gm .xpe-sg{display:flex;gap:2px;justify-content:center;margin-top:3px}
.gm .xpe-sg i{width:9px;height:4px;background:#D5DCE4}
.gm .xpe-sg i.on{background:#0F2B4A}
.gm .xpe-b{position:relative;flex:none;display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;background:#0F2B4A;color:#fff;font-size:9.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.gm .xpe-b svg{width:14px;height:14px}
.gm .xpe-b+.xpe-b{margin-top:-6px}
.gm .xpe-map{flex:none;height:62px;margin:0 calc(-1*var(--px));background-color:#EDF1E8;background-image:linear-gradient(160deg,transparent 40%,#F6D46B 40%,#F6D46B 43%,transparent 43%),linear-gradient(70deg,transparent 55%,#fff 55%,#fff 58%,transparent 58%);position:relative}
.gm .xpe-map i{position:absolute;left:40%;top:20px;width:12px;height:12px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#1E88E5}
.gm .xpe-nw{flex:none;margin:auto calc(-1*var(--px)) -12px;padding:9px 12px;background:#1E88E5;color:#fff;font-size:9.5px;font-weight:600;letter-spacing:.1em;text-align:center}
.gm .sk-peugeot .bq-k b,.gm .sk-peugeot .bq-m>b:first-child{color:#1E88E5}
.gm .sk-peugeot .bq-bars i{background:#DCE3EA}
.gm .sk-peugeot .bq-bars i.on{background:#0F2B4A}
.gm .sk-peugeot .m-btn{background:#0F2B4A;text-transform:uppercase;letter-spacing:.08em}
/* Škoda (MyŠkoda) */
.gm .xsk{margin:-6px calc(-1*var(--px)) 0;padding:2px 12px 0;flex:none}
.gm .xsk-hd{display:flex;align-items:center;justify-content:space-between}
.gm .xsk-hd b{display:flex;align-items:center;gap:6px;font-size:18px;font-weight:800;letter-spacing:-.01em;white-space:nowrap;min-width:0}
.gm .xsk-hd b svg{width:16px;height:16px;flex:none}
.gm .xsk-hd>svg{width:17px;height:17px;flex:none}
.gm .xsk-up{display:block;font-size:9px;color:#A7ABAE;margin-top:3px}
.gm .xsk-on{display:inline-flex;align-items:center;gap:4px;font-size:9px;color:#E8E8E8;margin-top:3px}
.gm .xsk-on i{width:6px;height:6px;border-radius:50%;background:#78FAAE}
.gm .xsk-img{height:96px;margin-top:2px;color:#fff}
.gm .xsk-c{position:relative;flex:none;background:#24272A;border-radius:14px;padding:10px 12px}
.gm .xsk-c.st{display:flex;align-items:center;gap:8px}
.gm .xsk-c.st>svg{width:16px;height:16px;color:#78FAAE;flex:none}
.gm .xsk-c.st span{flex:1;font-size:11px;font-weight:700}
.gm .xsk-c.st small{display:block;font-size:9px;font-weight:400;color:#A7ABAE}
.gm .xsk-tg{width:28px;height:16px;border-radius:8px;background:#78FAAE;position:relative;flex:none}
.gm .xsk-tg:after{content:"";position:absolute;right:2px;top:2px;width:12px;height:12px;border-radius:50%;background:#17191B}
.gm .xsk-bh{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:700}
.gm .xsk-bh svg{width:12px;height:12px;color:#A7ABAE}
.gm .xsk-bv{display:flex;align-items:baseline;gap:6px;margin-top:4px;color:#78FAAE;font-size:17px;font-weight:800}
.gm .xsk-bv small{font-size:11px;font-weight:600;color:#E8E8E8}
.gm .xsk-bar{display:block;position:relative;height:7px;border-radius:4px;margin-top:6px;background-color:#3A3E42;background-image:repeating-linear-gradient(135deg,transparent 0,transparent 3px,#4A4F54 3px,#4A4F54 4px);overflow:hidden}
.gm .xsk-bar i{position:absolute;left:0;top:0;bottom:0;background:#78FAAE;border-radius:4px}
.gm .xsk-bm{display:flex;flex-wrap:wrap;gap:4px 10px;margin-top:7px;font-size:9px;color:#C9CCCE}
.gm .xsk-bm span{display:inline-flex;align-items:center;gap:3px;white-space:nowrap}
.gm .xsk-bm svg{width:11px;height:11px;color:#78FAAE}
.gm .sk-skoda .m-btn{background:#78FAAE;color:#0E1A14;font-weight:800}
.gm .b-sko{text-align:center}
.gm .bk-rg{display:block;width:132px;height:132px;margin:0 auto;position:relative}
.gm .bk-rg svg{width:132px;height:132px}
.gm .bk-rg div{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.gm .bk-rg small{font-size:8.5px;color:#C9CCCE}
.gm .bk-rg b{font-size:26px;font-weight:800;color:#fff;line-height:1.1}
.gm .bk-ch{display:flex;align-items:center;justify-content:center;gap:5px;margin-top:8px;font-size:9.5px;color:#C9CCCE}
.gm .bk-ch i{font-style:normal;padding:3px 8px;border-radius:999px;border:1px solid #4A4F54;color:#E8E8E8}
.gm .bk-ch i.on{background:#78FAAE;border-color:#78FAAE;color:#0E1A14;font-weight:700}
.gm .bk-k{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:9px}
.gm .bk-k small{display:block;font-size:7.5px;color:#A7ABAE}
.gm .bk-k b{display:block;font-size:10px;color:#fff;margin-top:1px}
/* Toyota (MyToyota) */
.gm .xty{margin:-6px calc(-1*var(--px)) 0;padding:2px 12px 0;flex:none;text-align:center}
.gm .xty-pill{display:inline-block;font-size:9.5px;padding:3px 12px;border:1px solid #D9D9D9;border-radius:999px;color:#1A1A1A}
.gm .xty-img{height:92px;margin-top:4px;color:#1A1A1A}
.gm .xty-k{display:grid;grid-template-columns:1fr 64px 1fr;align-items:end;gap:4px;margin-top:2px}
.gm .xty-k b{display:block;font-size:12px;font-weight:600;color:#1A1A1A}
.gm .xty-k small{display:block;font-size:8px;color:#8A8A8A}
.gm .xty-g svg{width:64px;height:36px}
.gm .xty-dt{display:block;font-size:8.5px;color:#8A8A8A;margin-top:4px}
.gm .xty-st{display:inline-flex;align-items:center;gap:4px;font-size:10px;color:#1A1A1A;margin-top:4px}
.gm .xty-st svg{width:13px;height:13px;color:#2DB24A}
.gm .xty-c{position:relative;flex:none;border:1px solid #E6E6E6;border-radius:10px;padding:9px 11px;background:#fff}
.gm .xty-ch{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:600;color:#1A1A1A}
.gm .xty-ch svg{width:14px;height:14px;color:#8A8A8A}
.gm .xty-cb{display:flex;align-items:center;gap:10px;margin-top:7px}
.gm .xty-cb>i{width:34px;height:34px;border-radius:50%;border:1px solid #D9D9D9;display:flex;align-items:center;justify-content:center;color:#1A1A1A;flex:none}
.gm .xty-cb>i svg{width:16px;height:16px}
.gm .xty-cb span{font-size:10px;color:#4A4A4A}
.gm .xty-cb span b{display:block;font-size:13px;color:#1A1A1A}
.gm .b-toy{text-align:center;padding:2px 0}
.gm .bty-g svg{width:170px;height:96px}
.gm .bty-v{margin-top:-30px;font-size:24px;font-weight:600;color:#1A1A1A;line-height:1}
.gm .bty-s{display:block;font-size:9.5px;color:#6B6B6B;margin-top:5px}
.gm .bty-k{display:grid;grid-template-columns:1fr 1fr;margin-top:10px;border-top:1px solid #EFEFEF;padding-top:8px}
.gm .bty-k small{display:block;font-size:8px;color:#8A8A8A}
.gm .bty-k b{display:block;font-size:11.5px;color:#1A1A1A}
.gm .sk-toyota .m-btn{background:#EB0A1E}
/* Polestar */
.gm .xps{margin:-6px calc(-1*var(--px)) 0;padding:2px 12px 0;flex:none}
.gm .xps-top{display:grid;grid-template-columns:1fr 112px;gap:4px}
.gm .xps-l>b{display:block;font-size:20px;font-weight:300;color:#FF7500;line-height:1.08}
.gm .xps-bar{display:block;position:relative;height:16px;background:#3A3A3A;margin:7px 0 8px}
.gm .xps-bar i{position:absolute;left:0;top:0;bottom:0;background:#FF7500}
.gm .xps-bar em{position:absolute;top:-3px;bottom:-3px;width:2px;background:#fff}
.gm .xps-l small{display:block;font-size:8.5px;color:#9C9C9C}
.gm .xps-l p{margin:0 0 5px;font-size:11px;color:#fff}
.gm .xps-img{height:118px;color:#fff;align-self:center}
.gm .xps-img>svg{width:112px}
.gm .xps-g{flex:none;display:grid;grid-template-columns:1fr 1fr;gap:2px;margin:0 calc(-1*var(--px))}
.gm .xps-g>div{position:relative;height:84px;background:#2A2A2A;padding:7px 8px;display:flex;flex-direction:column}
.gm .xps-g>div.on{background:#FF7500;color:#101010}
.gm .xps-g b{font-size:10px;font-weight:400}
.gm .xps-g small{font-size:9px;color:#FF7500}
.gm .xps-g>div.on small{color:#101010}
.gm .xps-g em{position:absolute;right:8px;top:4px;font-style:normal;font-size:11px;letter-spacing:1px;color:#9C9C9C}
.gm .xps-g>div.on em{color:#101010}
.gm .xps-g>div>svg{width:17px;height:17px;margin-top:auto}
.gm .b-pol{padding:2px 0}
.gm .bpl-blk{position:relative;height:84px;background:#3A3A3A}
.gm .bpl-blk>span{position:absolute;left:0;top:0;bottom:0;background:#FF7500}
.gm .bpl-blk b{position:absolute;left:8px;top:6px;font-size:22px;font-weight:300;line-height:1.05;color:#101010;white-space:nowrap}
.gm .bpl-blk em{position:absolute;top:0;bottom:0;width:2px;background:#fff}
.gm .bpl-k{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}
.gm .bpl-k small{display:block;font-size:8.5px;color:#9C9C9C}
.gm .bpl-k b{display:block;font-size:11px;font-weight:400}
.gm .sk-polestar .m-btn{background:#FF7500;color:#101010}
/* smart */
.gm .xsm{margin:-6px calc(-1*var(--px)) 0;flex:none}
.gm .xsm-hero{padding:4px 12px 10px;background:linear-gradient(180deg,#3A3229 0,#2B2620 100%);border-radius:0 0 18px 18px}
.gm .xsm-hd{display:flex;justify-content:space-between;align-items:flex-start;gap:6px}
.gm .xsm-hd b{display:block;font-family:var(--hf);font-size:17px;font-weight:400;white-space:nowrap}
.gm .xsm-hd small{display:flex;align-items:center;gap:3px;font-size:8.5px;color:#BDB5A8;margin-top:2px;white-space:nowrap}
.gm .xsm-hd small svg{width:10px;height:10px}
.gm .xsm-av{width:26px;height:26px;border-radius:50%;background:#D7E600;color:#2B2620;display:flex;align-items:center;justify-content:center;flex:none}
.gm .xsm-av svg{width:14px;height:14px}
.gm .xsm-km{display:block;text-align:center;font-size:24px;font-weight:300;margin-top:6px}
.gm .xsm-km small{font-size:11px}
.gm .xsm-img{height:80px;color:#fff}
.gm .xsm-q{display:flex;justify-content:center;gap:9px;margin-top:6px}
.gm .xsm-q i{width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;color:#fff}
.gm .xsm-q svg{width:13px;height:13px}
.gm .xsm-c{position:relative;flex:none;display:flex;align-items:center;gap:9px;background:#2A2A2A;border-radius:14px;padding:9px 11px}
.gm .xsm-c>svg:first-child{width:16px;height:16px;flex:none}
.gm .xsm-c span{flex:1;min-width:0;font-size:10.5px;font-weight:600}
.gm .xsm-c small{display:block;font-size:8.5px;font-weight:400;color:#A3A3A3;margin-top:1px}
.gm .xsm-c small i{display:inline-block;width:5px;height:5px;border-radius:50%;background:#3DDC84;margin-right:3px;vertical-align:middle}
.gm .xsm-c em{font-style:normal;font-size:9px;padding:3px 10px;border:1px solid #fff;border-radius:999px}
.gm .xsm-c>svg:last-child{width:12px;height:12px;color:#A3A3A3;transform:rotate(90deg);flex:none}
.gm .b-sma{background:#2A2A2A;border-radius:14px;padding:10px 11px}
.gm .bsm-h{display:flex;align-items:center;gap:8px}
.gm .bsm-h>svg:first-child{width:16px;height:16px}
.gm .bsm-h span{flex:1;font-size:10.5px;font-weight:600}
.gm .bsm-h small{display:block;font-size:8.5px;font-weight:400;color:#A3A3A3}
.gm .bsm-h small i{display:inline-block;width:5px;height:5px;border-radius:50%;background:#3DDC84;margin-right:3px;vertical-align:middle}
.gm .bsm-h>svg:last-child{width:12px;height:12px;color:#A3A3A3;transform:rotate(-90deg)}
.gm .bsm-l{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:9.5px;color:#D4D4D4}
.gm .bsm-l b{color:#fff}
.gm .bsm-l em{font-style:normal;font-size:9px;padding:3px 10px;border:1px solid #fff;border-radius:999px;color:#fff}
.gm .bsm-s{display:block;position:relative;height:4px;border-radius:2px;background:#4A4A4A;margin:12px 4px 4px}
.gm .bsm-s i{position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:#3DDC84}
.gm .bsm-s em{position:absolute;top:-5px;width:12px;height:12px;margin-left:-6px;background:#fff;transform:rotate(45deg);border-radius:2px}
.gm .sk-smart .m-btn{background:#D7E600;color:#000}
/* Tesla */
.gm .xte{margin:-6px calc(-1*var(--px)) 0;padding:2px 14px 0;flex:none}
.gm .xte-hd{display:flex;justify-content:space-between;align-items:flex-start}
.gm .xte-hd b{display:block;font-size:17px;font-weight:600;white-space:nowrap}
.gm .xte-bt{display:flex;align-items:center;gap:4px;font-size:10px;color:#D0D0D0;margin-top:2px}
.gm .xte-bt svg{width:15px;height:15px}
.gm .xte-hd small{display:block;font-size:9px;color:#8E8E93;margin-top:2px}
.gm .xte-hd>svg{width:17px;height:17px;margin-top:3px;flex:none}
.gm .xte-img{height:118px;margin:4px -14px 0;color:#fff}
.gm .xte-q{display:flex;justify-content:space-around;margin:8px 0 2px}
.gm .xte-q i{position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;color:#BDBDBD;border-radius:50%}
.gm .xte-q i.on{color:#fff;text-shadow:0 0 6px #fff}
.gm .xte-q svg{width:18px;height:18px}
.gm .xte-r{position:relative;flex:none;display:flex;align-items:center;gap:12px;padding:7px 2px}
.gm .xte-r>svg:first-child{width:17px;height:17px;color:#D0D0D0;flex:none}
.gm .xte-r span{flex:1;min-width:0;font-size:11.5px;font-weight:600}
.gm .xte-r small{display:block;font-size:9px;font-weight:400;color:#8E8E93;margin-top:1px}
.gm .xte-r>svg:last-child{width:12px;height:12px;color:#5A5A5E;flex:none}
/* --- Lote 6: Volkswagen, Volvo, XPENG, Zeekr --- */
.gm .xvw-img,.gm .xvo-img,.gm .xxp-img,.gm .xzk-img,.gm .bzk-img{display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}
.gm .xvw-img img,.gm .xvo-img img,.gm .xxp-img img,.gm .xzk-img img,.gm .bzk-img img{display:block;width:100%;height:100%;object-fit:cover}
.gm .xvw-img>svg,.gm .xvo-img>svg,.gm .xxp-img>svg,.gm .xzk-img>svg,.gm .bzk-img>svg{width:140px;color:currentColor;opacity:.55}
.gm .xvw svg,.gm .xvw-l svg,.gm .xvo svg,.gm .xvo-q svg,.gm .xxp svg,.gm .xxp-c2 svg,.gm .xxp-r svg,.gm .xzk svg,.gm .xzk-c svg,.gm .xzk-map svg,.gm .b-tgg svg,.gm .b-vol svg,.gm .b-xp svg{stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
,.gm .dev.h-x-vw .m-body,.gm .dev.h-x-volvo .m-body,.gm .dev.h-x-xpeng .m-body,.gm .dev.h-x-zeekr .m-body{padding:0;gap:0}
/* Volkswagen (nova app) */
.gm .dev.h-x-vw .scr{background-color:#F4F2EE;background-image:linear-gradient(180deg,#E2DCD1 0%,#ECE8E1 34%,#F4F2EE 56%)}
.gm .xvw{flex:none;padding:2px 12px 0;color:#0F1B33}
.gm .xvw-hd{display:grid;grid-template-columns:20px 1fr 20px;align-items:center}
.gm .xvw-hd b{grid-column:2;text-align:center;font-size:12.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gm .xvw-hd svg{width:16px;height:16px}
.gm .xvw-img{height:130px;margin:6px -12px 0;color:#0F1B33}
.gm .xvw-k{display:grid;grid-template-columns:1.3fr 1fr;gap:8px;margin-top:8px}
.gm .xvw-ch{position:relative;min-width:0;min-height:94px;display:flex;flex-direction:column;background:#0F1B33;color:#fff;border-radius:6px;padding:10px}
.gm .xvw-ch i{display:block;width:36px;height:2px;background:#3CC46B;margin-bottom:auto}
.gm .xvw-ch b{font-size:22px;font-weight:300;line-height:1.1}
.gm .xvw-ch b small{font-size:10px;margin-left:2px}
.gm .xvw-ch>small{font-size:8.5px;color:#C7CEDB;white-space:nowrap}
.gm .xvw-ac{min-width:0;display:flex;flex-direction:column;background:#fff;border-radius:6px;padding:10px}
.gm .xvw-ac svg{width:16px;height:16px;margin-bottom:auto}
.gm .xvw-ac b{font-size:18px;font-weight:300}
.gm .xvw-ac small{font-size:8.5px;color:#6A7385;white-space:nowrap}
.gm .xvw-l{flex:none;margin:8px 12px 0;padding:0 10px;background:#fff;border-radius:6px;color:#0F1B33}
.gm .xvw-l div{display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid #ECE9E4;font-size:10.5px}
.gm .xvw-l div:last-child{border-bottom:0}
.gm .xvw-l span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gm .xvw-l svg{width:14px;height:14px;flex:none}
.gm .xvw-l svg:last-child{width:10px;height:10px;color:#6A7385}
.gm .b-vwa{background:#fff;border-radius:6px;padding:10px 12px;text-align:center;color:#0F1B33}
.gm .bvw-g{position:relative;display:block;width:150px;height:84px;margin:0 auto}
.gm .bvw-g svg{display:block;width:150px;height:88px}
.gm .bvw-g b{position:absolute;left:0;right:0;bottom:4px;font-size:28px;font-weight:300;color:#1E8C3A}
.gm .bvw-g b small{font-size:12px;margin-left:2px}
.gm .bvw-s{display:block;margin-top:4px;font-size:9.5px}
.gm .bvw-x{display:grid;grid-template-columns:repeat(3,1fr);margin-top:9px;border:1px solid #E4E1DB;border-radius:4px}
.gm .bvw-x span{padding:7px 2px;border-left:1px solid #E4E1DB;font-size:9px;white-space:nowrap}
.gm .bvw-x span:first-child{border-left:0}
.gm .bvw-t{display:flex;justify-content:space-between;padding:7px 2px 0;font-size:9.5px;color:#6A7385}
.gm .bvw-t b{color:#0F1B33}
.gm .sk-volkswagen .m-btn{background:#0F1B33;color:#fff}
/* Volvo Cars (nova app) */
.gm .dev.h-x-volvo .scr{background-color:#3B413D}
.gm .xvo{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;padding:2px 14px 8px;color:#fff;overflow:hidden}
.gm .xvo-hd{display:flex;justify-content:space-between;align-items:center}
.gm .xvo-pl{display:flex;align-items:center;gap:4px;height:22px;padding:0 9px;border-radius:11px;background:rgba(255,255,255,.14);font-size:9.5px;white-space:nowrap}
.gm .xvo-pl svg{width:8px;height:8px;transform:rotate(90deg)}
.gm .xvo-hd i{width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center}
.gm .xvo-hd i svg{width:12px;height:12px}
.gm .xvo-k{position:relative;z-index:1;display:block;flex:none;margin-top:8px;font-size:28px;font-weight:300;line-height:1.04;letter-spacing:-.02em}
.gm .xvo-img{position:relative;right:auto;bottom:auto;align-self:center;width:min(100%,230px);height:96px;min-height:72px;margin:5px auto 4px;color:#fff;flex:1 1 auto}
.gm .xvo-img img{object-fit:contain;padding:0 4px}
.gm .xvo-st{position:relative;z-index:1;left:auto;right:auto;bottom:auto;display:flex;flex:none;justify-content:space-between;align-items:center;gap:6px;padding:6px;border-radius:6px}
.gm .xvo-st span{display:flex;align-items:center;gap:5px;font-size:12px;white-space:nowrap}
.gm .xvo-st svg{width:14px;height:14px;color:#5BE37D}
.gm .xvo-st small{font-size:8.5px;color:#B9BFBB;white-space:nowrap}
.gm .xvo-q{flex:none;display:flex;justify-content:space-around;padding:9px 6px;background:#4A504C}
.gm .xvo-q i{width:30px;height:30px;display:flex;align-items:center;justify-content:center;color:#E8EBE9}
.gm .xvo-q svg{width:17px;height:17px}
.gm .sk-volvo .m-tabs{background:#141414;border-top:0}
.gm .sk-volvo .m-btn{background:#fff;color:#141414}
.gm .b-vol{padding:2px 0 6px}
.gm .bvo-p{display:block;font-size:40px;font-weight:300;line-height:1;letter-spacing:-.02em}
.gm .bvo-k{display:block;margin-top:2px;font-size:20px;font-weight:300}
.gm .bvo-st{display:flex;align-items:center;gap:8px;margin-top:12px}
.gm .bvo-st i{width:30px;height:30px;flex:none;border-radius:50%;background:#1F3A27;box-shadow:0 0 14px rgba(70,220,110,.55);display:flex;align-items:center;justify-content:center;color:#5BE37D}
.gm .bvo-st svg{width:15px;height:15px}
.gm .bvo-st span{font-size:12px}
.gm .bvo-st small{display:block;font-size:9px;color:#A3A8A5}
/* XPENG */
.gm .dev.sk-xpeng .scr{background-color:#F1F4FB}
.gm .dev.h-x-xpeng .scr{background-image:linear-gradient(180deg,#D6E2FF 0%,#E6EDFF 38%,#F1F4FB 64%)}
.gm .xxp{flex:none;padding:2px 12px 0;color:#111318}
.gm .xxp-hd{display:flex;justify-content:space-between;align-items:flex-start}
.gm .xxp-k{display:flex;align-items:flex-end;gap:3px;color:#111318}
.gm .xxp-k b{font-size:26px;font-weight:600;line-height:1}
.gm .xxp-k span{display:flex;flex-direction:column;font-size:9px;font-weight:600;line-height:1.1}
.gm .xxp-k span small{font-size:6.5px;font-weight:500;color:#7A8090}
.gm .xxp-k em{margin-left:4px;font-style:normal;font-size:8.5px;color:#7A8090}
.gm .xxp-hd>span{display:flex;gap:10px}
.gm .xxp-hd>span svg{width:16px;height:16px}
.gm .xxp-bar{display:block;width:96px;height:2px;margin-top:5px;background:#C9D0E0}
.gm .xxp-bar i{display:block;height:100%;background:#111318}
.gm .xxp-st{display:flex;justify-content:flex-end;align-items:center;gap:4px;margin-top:2px;font-size:8.5px}
.gm .xxp-st i{width:5px;height:5px;border-radius:50%;background:#26B36B}
.gm .xxp-img{height:122px;margin:2px -12px 0;color:#111318}
.gm .xxp-q{display:flex;justify-content:space-around;margin-top:6px}
.gm .xxp-q span{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:8.5px;color:#7A8090}
.gm .xxp-q svg{width:17px;height:17px;color:#111318}
.gm .xxp-q span.on,.gm .xxp-q span.on svg{color:#26B36B}
.gm .xxp-c2{flex:none;display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:10px 12px 0}
.gm .xxp-c2>div{min-width:0;background:#fff;border-radius:12px;padding:8px 9px}
.gm .xxp-c2 b{display:flex;align-items:center;gap:2px;font-size:10px;font-weight:600;color:#111318;white-space:nowrap}
.gm .xxp-c2 b svg{width:9px;height:9px;color:#7A8090}
.gm .xxp-c2 small{display:block;margin-top:2px;font-size:8px;color:#7A8090;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gm .xxp-c2 p{display:flex;justify-content:space-around;margin:8px 0 0}
.gm .xxp-c2 p span{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:7.5px;color:#7A8090;white-space:nowrap}
.gm .xxp-c2 p svg{width:15px;height:15px;color:#111318}
.gm .xxp-r{flex:none;position:relative;display:flex;align-items:center;gap:9px;margin:8px 12px 0;padding:9px 10px;background:#fff;border-radius:12px}
.gm .xxp-r>svg:first-child{width:16px;height:16px;color:#26B36B;flex:none}
.gm .xxp-r span{flex:1;min-width:0;font-size:11px;font-weight:600;color:#111318}
.gm .xxp-r small{display:block;font-size:8.5px;font-weight:400;color:#7A8090}
.gm .xxp-r>svg:last-child{width:11px;height:11px;color:#7A8090;flex:none}
.gm .b-xp{background:#fff;border-radius:14px;padding:12px}
.gm .b-xp .xxp-bar{width:auto;margin-top:8px}
.gm .bxp-s{display:flex;align-items:center;gap:5px;margin-top:8px;font-size:9.5px;color:#7A8090}
.gm .bxp-s i{width:6px;height:6px;border-radius:50%;background:#26B36B}
.gm .sk-xpeng .m-btn{background:#111318;color:#fff}
/* Zeekr */
.gm .dev.sk-zeekr .scr{background-color:#F6F3EF}
.gm .dev.h-x-zeekr .scr{background-image:linear-gradient(180deg,#D9D0C5 0%,#E8E2DA 38%,#F6F3EF 60%)}
.gm .xzk{flex:none;padding:2px 14px 0;color:#1E2228}
.gm .xzk-nm{display:flex;align-items:center;gap:4px;font-size:10px;font-weight:600;letter-spacing:.04em;white-space:nowrap}
.gm .xzk-nm svg{width:11px;height:11px}
.gm .xzk-p{display:block;margin-top:8px;font-size:30px;font-weight:400;line-height:1}
.gm .xzk-p small{font-size:11px;margin-left:2px}
.gm .xzk-bar{display:block;width:44px;height:2px;margin-top:6px;background:#C9C1B6}
.gm .xzk-bar i{display:block;height:100%;background:#3DBE5A}
.gm .xzk-st{display:block;margin-top:5px;font-size:9px;color:#6E7178}
.gm .xzk-img{height:122px;margin:4px -14px 0;color:#1E2228}
.gm .xzk-c{flex:none;margin:8px 12px 0;padding:10px 10px 0;background:#fff;border-radius:10px;color:#1E2228}
.gm .xzk-q{display:flex;justify-content:space-around}
.gm .xzk-q i{position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:8px}
.gm .xzk-q i.or{color:#F07C28}
.gm .xzk-q svg{width:18px;height:18px}
.gm .xzk-rc{display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding:8px 0;border-top:1px solid #EEEAE4;font-size:9.5px}
.gm .xzk-rc svg{width:10px;height:10px;color:#9A9DA3}
.gm .xzk-map{flex:none;position:relative;margin:8px 12px 0;padding:9px 10px;height:58px;background-color:#fff;background-image:linear-gradient(118deg,transparent 58%,#EDE8E1 58%,#EDE8E1 61%,transparent 61%),linear-gradient(32deg,transparent 70%,#F1EDE7 70%,#F1EDE7 73%,transparent 73%);border-radius:10px;color:#1E2228}
.gm .xzk-map b{display:block;font-size:10.5px;font-weight:600}
.gm .xzk-map small{display:block;font-size:8.5px;color:#7B7F86}
.gm .xzk-map i{position:absolute;right:14px;top:14px;width:30px;height:30px;border-radius:50%;background:#1E2228;color:#fff;display:flex;align-items:center;justify-content:center}
.gm .xzk-map svg{width:14px;height:14px}
.gm .b-zk{text-align:center;color:#1E2228}
.gm .bzk-km{display:block;font-size:22px;font-weight:600}
.gm .bzk-km small{font-size:11px;margin-left:2px}
.gm .bzk-car{position:relative;height:84px;margin:4px -12px 0}
.gm .bzk-img{height:84px;opacity:.45;color:#1E2228}
.gm .bzk-cell{position:absolute;left:50%;top:50%;width:86px;height:18px;margin:-9px 0 0 -43px;overflow:hidden;border:1px solid #3DBE5A;border-radius:3px;background:rgba(255,255,255,.75)}
.gm .bzk-cell i{position:relative;display:block;height:100%;background:#3DBE5A}
.gm .bzk-cell em{position:absolute;right:3px;top:3px;font-style:normal;font-size:8.5px;font-weight:700;color:#fff}
.gm .bzk-st{display:flex;justify-content:center;gap:14px;margin-top:4px;font-size:8.5px;color:#6E7178;white-space:nowrap}
.gm .bzk-st i{display:inline-block;width:5px;height:5px;margin-right:4px;border-radius:50%;background:#B9B4AD;vertical-align:1px}
.gm .bzk-st i.on{background:#3DBE5A}
.gm .bzk-lim{margin-top:10px;padding:10px 12px;background:#fff;border-radius:10px;text-align:left}
.gm .bzk-lim b{display:block;font-size:11px;font-weight:600}
.gm .bzk-lim small{display:block;margin-top:2px;font-size:8.5px;color:#7B7F86}
.gm .bzk-sl{position:relative;display:block;height:4px;margin:10px 0 4px;background:#E8E4DE;border-radius:2px}
.gm .bzk-sl i{display:block;height:100%;background:#3DBE5A;border-radius:2px}
.gm .bzk-sl em{position:absolute;top:-4px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25)}
.gm .sk-zeekr .m-btn{background:#1E2228;color:#fff}
@media (max-width:360px){.gm .dev.phone{width:100%}}
`;

let MS={screen:0,family:null,photo:null};
const IC={plug:'<path d="M9 2v5M15 2v5"/><path d="M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
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
Object.assign(IC,{
  unlock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.6-1.7"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  horn:'<path d="M4 10v4h3l5 4V6L7 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  door:'<path d="M4 17V9l6-4h10v12z"/><path d="M4 11h16"/>',
  sync:'<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  tribe:'<path d="M3 5l9 4 9-4-9 15z"/>',
  bt:'<path d="m7 7 10 10-5 4V3l5 4L7 17"/>',
  cars:'<path d="M5 10h14M6 14h12M7 18h10"/><path d="M6 10l1.5-4h9L18 10"/>',
  bat:'<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4"/>'
});
Object.assign(IC,{
  trunk:'<path d="M3 15h18v4H3z"/><path d="M5 15l2-6h10l2 6"/>',
  window:'<path d="M4 18V9l5-4h11v13z"/><path d="M9 5v13"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  key:'<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/>',
  share:'<circle cx="7" cy="9" r="3"/><circle cx="17" cy="9" r="3"/><path d="M2 20a5 5 0 0 1 10 0M12 20a5 5 0 0 1 10 0"/>',
  qr:'<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3M20 14v6h-6"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>'
});
Object.assign(IC,{
  bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  send:'<path d="M21 3 3 10.5l7 2.5 2.5 7z"/><path d="m10 13 4-4"/>',
  gauge:'<path d="M4 17a8 8 0 1 1 16 0"/><path d="m12 17 4-5"/>',
  plug:'<path d="M9 3v5M15 3v5M7 8h10v4a5 5 0 0 1-10 0z"/><path d="M12 17v4"/>'
});
Object.assign(IC,{
  power:'<path d="M12 3v8"/><path d="M6.3 7.5a8 8 0 1 0 11.4 0"/>',
  hazard:'<path d="M12 4 3 19h18z"/><path d="M12 10v4M12 17h.01"/>',
  search:'<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  wave:'<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/>',
  cloud:'<path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z"/>'
});
Object.assign(IC,{
  plus:'<path d="M12 5v14M5 12h14"/>',
  leaf:'<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19 13 11"/>'
});
function iconKey(l){const n=norm(l);return /carreg|eletric|energia|bateria/.test(n)?"bolt":/clima|ar cond/.test(n)?"fan":/naveg/.test(n)?"nav":/media|music/.test(n)?"music":/defin/.test(n)?"gear":/telef/.test(n)?"phone":/trajet|viage/.test(n)?"route":/manut|servic/.test(n)?"wrench":/tranc|control/.test(n)?"lock":/estado|seguran/.test(n)?"shield":/veicul|carro/.test(n)?"car":"pin";}
function icon(l){return svg(iconKey(l));}
const DAYS=["S","T","Q","Q","S","S","D"];
const QUICK=[["lock","Trancar"],["fan","Clima"],["light","Luzes"],["pin","Localizar"]];
const TAB_IC={"Navegação":"nav","Definições":"gear","Inspecionar":"search","Áudio":"wave","Internet":"globe","Funcionalidades":"grid","Navegar":"send","Compras":"bag","Ideias":"light","Mensagens":"chat","Segurança":"shield","Descobrir":"grid","Viagens":"pin","Painel":"gauge","Centro pessoal":"user","Partilhar":"share","Emprestar":"key","Notificações":"bell","Ajuda":"chat","O meu veículo":"car","A minha conta":"user","Mapas":"map","Tribe":"tribe","Início":"home","Estado":"car","Carro":"car","Veículo":"car","Mapa":"pin","Serviços":"wrench","Perfil":"user","Conta":"user","Eu":"user","Carregar":"bolt","Loja":"bag","Controlo":"lock","Remoto":"lock","Mais":"more","Menu":"more","Explorar":"route"};
const TAB_DEF=["Início\u2060","Mapa","Carregar","Serviços","Perfil"];
const fillT=(t,p)=>String(t).replace(/\{inicio\}/g,p.s).replace(/\{fim\}/g,p.e);
/* cores auxiliares */
function hexRgb(h){h=h.replace("#",""); if(h.length===3) h=h.split("").map(c=>c+c).join(""); return [0,2,4].map(i=>parseInt(h.substr(i,2),16));}
function lum(h){return hexRgb(h).map(v=>{v/=255; return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);}
function contrast(a,b){const x=lum(a),y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
const rgba=(h,a)=>"rgba("+hexRgb(h).join(",")+","+a+")";
function carImg(){return MS.photo?'<img src="'+esc(MS.photo.src)+'" alt="">':CAR_SVG;}
function ringHTML(p){const c=2*Math.PI*26; return '<span class="m-rg"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" fill="none" stroke-width="6" class="rt" style="stroke:var(--line)"/><circle cx="32" cy="32" r="26" fill="none" stroke-width="6" stroke-linecap="round" class="rf" style="stroke:var(--ringc)" stroke-dasharray="'+(c*p/100).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle" class="rv" style="fill:var(--fg)">'+p+'%</text></svg></span>';}
function battHTML(p,K){
  if(K.batt==="vwarc"){const a=Math.PI*66, d=(a*p/100).toFixed(1); return '<div class="m-batt b-vwa"><span class="bvw-g"><svg viewBox="0 0 150 88" aria-hidden="true"><path d="M9 82a66 66 0 0 1 132 0" fill="none" stroke="#E4E1DB" stroke-width="3" stroke-linecap="round"/><path d="M9 82a66 66 0 0 1 132 0" fill="none" stroke="#1E8C3A" stroke-width="3" stroke-linecap="round" stroke-dasharray="'+d+' '+a.toFixed(1)+'"/></svg><b>280<small>km</small></b></span><small class="bvw-s">'+p+' % · Cabo ligado</small><div class="bvw-x"><span>À espera</span><span>280 km</span><span>0 kW</span></div><div class="bvw-t"><span>Nível de carga alvo</span><b>80 %</b></div></div>';}
  if(K.batt==="volvo") return '<div class="m-batt b-vol"><b class="bvo-p">'+p+'%</b><b class="bvo-k">280 km</b><div class="bvo-st"><i>'+svg("plug")+'</i><span>Cabo ligado<small>À espera do horário</small></span></div></div>';
  if(K.batt==="xpeng") return '<div class="m-batt b-xp"><div class="xxp-k"><b>280</b><span><small>WLTP</small>km</span><em>'+p+'%</em></div><span class="xxp-bar"><i style="width:'+p+'%"></i></span><small class="bxp-s"><i></i>Cabo ligado · à espera do horário</small></div>';
  if(K.batt==="zeekr") return '<div class="m-batt b-zk"><b class="bzk-km">280 <small>km</small></b><div class="bzk-car"><div class="bzk-img">'+carImg()+'</div><span class="bzk-cell"><i style="width:'+p+'%"><em>'+p+'%</em></i></span></div><div class="bzk-st"><span><i class="on"></i>Ligado</span><span><i></i>À espera do horário</span></div><div class="bzk-lim"><b>Limite de carga: 80%</b><small>Defina o limite entre 50% e 100%</small><span class="bzk-sl"><i style="width:80%"></i><em style="left:80%"></em></span></div></div>';
  if(K.batt==="nissan") return '<div class="m-batt b-nis"><div class="bns-h"><span>Nível da bateria</span><b>'+p+' %</b></div><span class="bns-l"><i style="width:'+p+'%"></i></span><div class="bns-t"><small>0%</small><small>25%</small><small>50%</small><small>75%</small><small>100%</small></div><div class="bns-r"><span>Autonomia máx. estimada</span><b>280 km</b></div><span class="bns-p">Cabo ligado · à espera do temporizador</span><small class="bns-u"><span>Última atualização</span><span>Agora mesmo</span></small></div>';
  if(K.batt==="skoda"){const c=2*Math.PI*56, d=(c*p/100).toFixed(1); return '<div class="m-batt b-sko"><span class="bk-rg"><svg viewBox="0 0 132 132" aria-hidden="true"><circle cx="66" cy="66" r="56" fill="none" stroke="#2E3236" stroke-width="10"/><circle cx="66" cy="66" r="56" fill="none" stroke="#78FAAE" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+d+' '+c.toFixed(1)+'" transform="rotate(-90 66 66)"/></svg><div><small>Cabo ligado</small><b>'+p+'%</b><small>Autonomia 280 km</small></div></span><div class="bk-ch">Carregar até<i class="on">80%</i><i>90%</i><i>100%</i></div><div class="bk-k"><div><small>Tempo</small><b>—</b></div><div><small>Fim</small><b>—</b></div><div><small>Velocidade</small><b>—</b></div><div><small>Potência</small><b>0 kW</b></div></div></div>';}
  if(K.batt==="toyota"){const a=Math.PI*70, d=(a*p/100).toFixed(1); return '<div class="m-batt b-toy"><span class="bty-g"><svg viewBox="0 0 170 96" aria-hidden="true"><path d="M15 88a70 70 0 0 1 140 0" fill="none" stroke="#EDEDED" stroke-width="9" stroke-linecap="round"/><path d="M15 88a70 70 0 0 1 140 0" fill="none" stroke="#1A1A1A" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+d+' '+a.toFixed(1)+'"/></svg></span><div class="bty-v">'+p+' %</div><small class="bty-s">Cabo ligado · à espera do horário</small><div class="bty-k"><div><small>Autonomia</small><b>280 km</b></div><div><small>Tempo até carga completa</small><b>5 h 40 min</b></div></div></div>';}
  if(K.batt==="polestar") return '<div class="m-batt b-pol"><div class="bpl-blk"><span style="width:'+p+'%"></span><b>'+p+'%<br>280 km</b><em style="left:80%"></em></div><div class="bpl-k"><div><small>Cabo ligado</small><b>À espera do horário</b></div><div><small>Potência</small><b>0 kW</b></div></div></div>';
  if(K.batt==="smart") return '<div class="m-batt b-sma"><div class="bsm-h">'+svg("bolt")+'<span>Bateria<small>280 km · '+p+' % · <i></i>Cabo ligado</small></span>'+svg("chev")+'</div><div class="bsm-l"><span>Limite de carga <b>80%</b></span><em>Iniciar carregamento</em></div><span class="bsm-s"><i style="width:80%"></i><em style="left:80%"></em></span></div>';
  if(K.batt==="porsche") return '<div class="m-batt b-por"><div class="bp-dep"><small>Partida</small><b>08:00</b><small>Amanhã · Perfil: Geral</small></div><div class="bp-v"><b>'+p+'<small>%</small></b><div class="bp-tank"><i style="height:'+p+'%"></i><em style="bottom:80%"></em></div><b>280<small>km</small></b></div><small class="bp-kw">'+svg("bolt")+'Cabo ligado · à espera do horário</small></div>';
  if(K.batt==="seat") return '<div class="m-batt b-seat"><div class="bse-v"><span class="bse-fill" style="width:'+p+'%"></span><div class="bse-t"><b>'+p+' %</b><small>160 km</small></div><div class="bse-img">'+carImg()+'</div></div><div class="bse-st"><div><small>Potência</small><b>0 kW</b></div><div><small>Energia</small><b>0 kWh</b></div><div><small>Início</small><b>'+esc(MS.p?MS.p.s:"22:00")+'</b></div></div></div>';
  if(K.batt==="audi") return '<div class="m-batt b-audi"><div class="ba-k"><b>280<small> km</small></b><span>'+p+' %</span></div><span class="ba-bar"><i style="width:'+p+'%"></i><em style="left:80%"></em></span><small>Cabo ligado · à espera do horário</small></div>';
  if(K.batt==="stl"){let bars=""; for(let j=0;j<10;j++) bars+='<i class="'+(j*10<p?"on":"")+'"></i>'; return '<div class="m-batt b-stl"><small class="bq-up">Estado às 21:55</small><div class="bq-k"><div><small>Carregamento</small><b>Em espera</b></div><div><small>Velocidade</small><b>—</b></div><div><small>Tempo restante</small><b>—</b></div></div><div class="bq-m"><b>'+p+'%</b><span class="bq-bars">'+bars+'</span><b>280 km</b></div></div>';}
  if(K.batt==="bmw") return '<div class="m-batt b-bmw"><small>Cabo ligado · à espera do horário</small><b>'+p+'<small> %</small> / 280<small> km</small></b><small>Limite de carga: 80 %</small></div>';
  if(K.batt==="gwm") return '<div class="m-batt b-gwm"><small class="bg-t">Cabo ligado · à espera do horário</small><div class="bg-r"><div class="bg-img">'+carImg()+'</div>'+ringHTML(p)+'</div><div class="bg-st"><div><b>—</b><small>Tempo restante</small></div><div><b>280 km</b><small>Autonomia</small></div><div><b>450 km</b><small>A 100 %</small></div></div></div>';
  if(K.batt==="leap") return '<div class="m-batt b-leap"><div class="bl-h"><b>'+p+'<small>%</small></b><small>Cabo ligado · à espera do horário</small></div><span class="bl-c"><i style="width:'+p+'%"></i></span><div class="bl-st"><div><small>Corrente</small><b>0 A</b></div><div><small>Tensão</small><b>230 V</b></div><div><small>Potência</small><b>0 kW</b></div></div></div>';
  if(K.batt==="lynk") return '<div class="m-batt b-lynk"><span class="by-ch">'+svg("bolt")+'Cabo ligado</span><b class="by-km">280<small> km</small></b><small class="by-up">Atualizado: 21:55</small><span class="by-bar"><i style="width:'+p+'%">'+p+'%</i><em style="left:80%"></em></span></div>';
  if(K.batt==="cupra") return '<div class="m-batt b-cupra"><div class="bc-max">Máx. 80 %</div><div class="bc-vis"><div class="bc-fill" style="width:'+p+'%"></div><div class="bc-car">'+carImg()+'</div><div class="bc-lim" style="left:80%"></div><div class="bc-val"><b>'+p+'<small>%</small></b><span>280<small>km</small></span></div></div><div class="bc-st"><div><small>Potência</small><b>0 kW</b></div><div><small>Energia</small><b>0 kWh</b></div><div><small>Início</small><b>'+esc(MS.p?MS.p.s:"22:00")+'</b></div></div><div class="bc-sh"><i class="bc-grab"></i><b>Cabo ligado</b><small>À espera do horário</small><span class="bc-sl"><i style="width:80%"></i><em style="left:80%"></em></span><span class="bc-lb"><span>Recomendado</span><span>Autonomia máxima</span></span></div></div>';
  if(K.batt==="ford"){let seg=""; for(let j=0;j<20;j++) seg+='<i class="'+(j*5<p?"on":"")+'"></i>'; return '<div class="m-batt b-ford"><div class="bf-loc"><small>Localização</small><b>Casa</b><small>Cabo ligado · à espera do horário</small></div><div class="bf-h"><b>'+p+' %</b><span>280 km</span></div><span class="bf-seg">'+seg+'<em style="left:80%"></em></span><div class="bf-go">Iniciar carregamento</div></div>';}
  const plug='<small class="bt-s">'+svg("bolt")+'Cabo ligado · à espera do horário</small>';
  if(K.batt==="merc") return '<div class="m-batt b-merc"><b>'+svg("bat")+'280 km · '+p+' %</b><span class="bm-bar"><i style="width:'+p+'%"></i><em style="left:80%"></em></span>'+plug+'</div>';
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
/* Ecrãs iniciais próprios de cada app (baseados nas capturas da Google Play) */
function famName(){const f=MS.family; return f?f.name:"";}
function xLinks(s){const out=[]; s.rows.forEach((r,i)=>{if(r[0]==="link") out.push({l:r[1],sub:r[2]||"",h:(s.hl||[]).includes(i)});}); return out;}
const XH={
  "x-byd":(K,name,s)=>{
    const L=xLinks(s);
    return '<div class="xb"><div class="xb-nm">'+esc(name)+'<svg class="xb-tri" viewBox="0 0 8 8" aria-hidden="true"><path d="M8 0V8H0z"/></svg></div><div class="xb-rg"><b>280km</b><span><i style="width:62%"></i></span></div><div class="xb-st">Parado<em></em><span>Atualizado: 21:55</span>'+svg("sync")+'</div><div class="xb-img">'+carImg()+'</div>'+
      '<div class="xb-q">'+["unlock","lock","light","car"].map(k=>'<i>'+svg(k)+'</i>').join("")+'</div>'+
      '<div class="xb-cards"><div class="xb-c xb-ac"><span>–</span><b>22°</b><span>+</span></div><div class="xb-c">'+svg("door")+'<div><b>Portas e janelas</b><small>Normal</small></div></div>'+
      L.map(x=>'<div class="xb-c xb-w'+(x.h?" hl":"")+'">'+svg("bolt")+'<div><b>'+esc(x.l)+'</b><small>'+esc(x.sub)+'</small></div>'+svg("chev","xb-ch")+'</div>').join("")+'</div></div>';
  },
  "x-denza":(K,name,s)=>{
    const L=xLinks(s);
    return '<div class="xd"><div class="xd-hd"><b>'+esc(name.toUpperCase())+'</b><svg class="xd-tri" viewBox="0 0 8 10" aria-hidden="true"><path d="M0 0l8 5-8 5z"/></svg><span class="xd-bt">'+svg("bt")+svg("chev")+'</span></div><div class="xd-st">Desligado<em></em><span>Atualizado: 21:55</span></div>'+
      '<div class="xd-rg"><b>280</b><div><span>'+svg("bat")+'62%</span><i><em style="width:62%"></em></i><small>km</small></div></div><div class="xd-img">'+carImg()+'</div>'+
      '<div class="xd-q">'+["unlock","lock","light","horn"].map(k=>'<i>'+svg(k)+'</i>').join("")+'</div><div class="xd-dots"><i class="on"></i><i></i></div>'+
      L.map(x=>'<div class="xd-c'+(x.h?" hl":"")+'">'+svg("bolt")+'<div><b>'+esc(x.l)+'</b><small>'+esc(x.sub)+'</small></div>'+svg("chev")+'</div>').join("")+'</div>';
  },
  "x-cupra":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{l:"Carregamento",h:0}, cl=L[1];
    return '<div class="xc"><div class="xc-top"><span class="xc-pill">'+svg("car")+'<b>'+esc(fam.toUpperCase())+'</b>'+svg("chev","xc-dn")+'</span><span class="xc-bell">'+svg("bell")+'<i></i></span></div>'+
      '<div class="xc-up">Atualizado agora '+svg("sync")+'</div><div class="xc-km">'+svg("bat")+'<b>280</b><small>km</small></div><div class="xc-img">'+carImg()+'</div>'+
      '<div class="xc-ctl"><i class="xc-l on">'+svg("lock")+'</i><i class="xc-r">'+svg("unlock")+'</i><i>'+svg("horn")+'</i><i>'+svg("light")+'</i></div><div class="xc-lab"><small class="on">Trancado</small><small>Buzina</small><small>Luzes</small></div>'+
      '<div class="xc-cards"><div class="xc-c'+(c.h?" hl":"")+'"><h5>'+esc(c.l)+'</h5><b class="xc-pc">62<small>%</small></b><span>280 km</span><span class="xc-bar"><i style="width:62%"></i><em style="left:80%"></em></span></div>'+
      (cl?'<div class="xc-c'+(cl.h?" hl":"")+'"><h5>'+esc(cl.l)+'</h5><span>'+esc(cl.sub)+'</span><small>Temperatura</small><b>20,0<small>°C</small></b></div>':'')+'</div></div>';
  },
  "x-fiat":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{h:0};
    return '<div class="xf"><div class="xf-hd"><b>'+esc(fam)+svg("chev","xf-dn")+'</b><span>'+svg("bell")+svg("menu")+'</span></div><div class="xf-wm">FIAT</div><div class="xf-img">'+carImg()+'</div></div>'+
      '<div class="xf-body"><div class="xf-c'+(c.h?" hl":"")+'"><div class="xf-b"><div><b>280 <small>Km</small></b><em></em><b>62<small>%</small></b></div><small>Autonomia · Bateria</small><span class="xf-bat"><i style="width:62%"></i></span></div><span class="xf-btn">Procurar carga</span></div>'+
      '<div class="xf-c xf-lk"><span>'+svg("unlock")+'Destrancar</span><span>'+svg("lock")+'Trancar</span></div>'+'</div>';
  },
  "x-ford":(K,name,s)=>{
    return '<div class="xo"><div class="xo-tb"><span>'+svg("cars")+'</span><span>'+svg("user")+'</span></div><small class="xo-md">'+esc(name)+'</small><b class="xo-st">Estacionado</b>'+
      '<div class="xo-loc">'+svg("pin")+'<span>Localização</span>'+svg("chev")+'</div><div class="xo-img">'+carImg()+'</div>'+
      '<div class="xo-kpi"><div><small>'+svg("bolt")+'Autonomia</small><b>62% 280 km</b></div><div><small>Próxima partida</small><b>Seg 08:00</b></div></div>'+
      '<div class="xo-btn">'+svg("fan")+'Climatização</div><div class="xo-row"><span>'+svg("lock")+'</span><span>'+svg("unlock")+'</span><span>'+svg("bt")+'Controlos</span></div><b class="xo-sec">Horários</b></div>';
  },
  "x-porsche":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{l:"Bateria",sub:"",h:0};
    return '<div class="xpo"><small class="xpo-up">Dados do veículo das 21:55</small><b class="xpo-nm">O meu '+esc(fam)+svg("chev")+'</b><span class="xpo-ch">'+svg("check")+'Detalhes do veículo</span><div class="xpo-img">'+carImg()+'</div>'+
      '<div class="xpo-q"><i>'+svg("lock")+'</i><i>'+svg("horn")+'</i><i>'+svg("key")+'</i></div></div>'+
      '<div class="xpo-bt'+(c.h?" hl":"")+'"><span class="xpo-fill" style="width:62%"></span><div><b>'+esc(c.l)+'</b><small>'+esc(c.sub)+'</small><p><em>280</em>km | <em>62</em>%</p></div><i>'+svg("qr")+'</i></div>'+
      '<div class="xpo-cl"><div><b>Climatização</b><small><em>20,0 °C</em>Temperatura</small></div><span class="xpo-tg"></span></div>';
  },
  "x-seat":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{h:0};
    return '<div class="xse"><div class="xse-hd">'+svg("cars")+'<b>SEAT '+esc(fam)+svg("chev")+'</b><span>'+svg("bell")+'<i></i></span></div><small class="xse-up">Atualizado agora'+svg("sync")+'</small><div class="xse-km">'+svg("bat")+'<b>160</b>km</div><div class="xse-img">'+carImg()+'</div><span class="xse-st">'+svg("check")+'Estado do veículo</span>'+
      '<div class="xse-q"><span class="lk"><i>'+svg("lock")+svg("unlock")+'</i>Destrancado</span><span><i>'+svg("horn")+'</i>Buzina</span><span><i>'+svg("light")+'</i>Luzes</span></div></div>'+
      '<div class="xse-g"><div class="xse-c'+(c.h?" hl":"")+'"><b>Carregamento</b><p>62 <small>%</small></p><small>160 km</small><span class="xse-hex"><i style="width:62%"></i></span></div><div class="xse-c"><b>Climatização</b><small>Desligada</small><p class="xse-t">17,5 <small>°C</small></p>'+svg("power")+'</div></div>';
  },
  "x-audi":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{h:0};
    return '<div class="xad"><div class="xad-hd"><div><b>'+esc(fam)+' ›</b><small>'+svg("sync")+'Agora mesmo</small></div><span class="xad-av">'+svg("user")+'</span></div><div class="xad-img">'+carImg()+'</div>'+
      '<div class="xad-k"><b>280<small> km</small></b><span>62 %</span></div><span class="xad-bar"><i style="width:62%"></i></span><small class="xad-sub">Cabo ligado · à espera do horário</small></div>'+
      '<div class="xad-g"><div>Trancar'+svg("lock")+'</div><div class="xad-ch'+(c.h?" hl":"")+'">Carregamento'+svg("bolt")+'<b>62 %</b><small><i></i>Cabo ligado</small></div><div class="on">Destrancado'+svg("unlock")+'</div></div>'+
      '<div class="xad-g"><div>Climatização'+svg("fan")+'</div><div>Localização'+svg("pin")+'</div></div>';
  },
  "x-citroen":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, ic=["plug","fan"];
    return '<div class="xci"><div class="xci-hd"><b>Citroën '+esc(fam)+svg("chev")+'</b>'+svg("user")+'</div><div class="xci-tb"><i class="on">'+svg("home")+'</i><i>'+svg("gauge")+'</i><i>'+svg("wrench")+'</i><i>'+svg("car")+'</i></div>'+
      '<div class="xci-hero"><b class="xci-my">MY</b><div class="xci-img">'+carImg()+'</div></div><small class="xci-st">O veículo está trancado</small><div class="xci-q"><i>'+svg("horn")+'</i><i>'+svg("light")+'</i><i>'+svg("lock")+'</i><i>'+svg("unlock")+'</i></div></div>'+
      L.map((x,j)=>'<div class="xci-r'+(x.h?" hl":"")+'">'+svg(ic[j]||"grid")+'<span>'+esc(x.l)+(x.sub?'<small>'+esc(x.sub)+'</small>':'')+'</span>'+svg("chev")+'</div>').join("")+
      '<div class="xci-nw">CITROËN NEWS<em>3</em></div>';
  },
  "x-ds":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, ic=["plug","fan"];
    return '<div class="xds"><div class="xds-hd"><b>'+esc(fam)+svg("chev")+'</b>'+svg("user")+'</div><div class="xds-tb"><i class="on">'+svg("home")+'</i><i>'+svg("gauge")+'</i><i>'+svg("wrench")+'</i><i>'+svg("car")+'</i></div>'+
      '<div class="xds-img">'+carImg()+'</div><small class="xds-st">O veículo está trancado</small><div class="xds-q"><i>'+svg("horn")+'</i><i>'+svg("light")+'</i><i>'+svg("lock")+'</i><i>'+svg("unlock")+'</i></div></div>'+
      L.map((x,j)=>'<div class="xds-r'+(x.h?" hl":"")+'">'+svg(ic[j]||"grid")+'<span>'+esc(x.l)+(x.sub?'<small>'+esc(x.sub)+'</small>':'')+'</span>'+svg("chev")+'</div>').join("");
  },
  "x-hyundai":(K,name,s)=>{
    const L=xLinks(s), c=L[0]||{l:"Carregamento",h:0};
    return '<div class="xhy"><div class="xhy-hd"><b>Início\u2060</b><span>'+svg("bell")+svg("user")+'</span></div><div class="xhy-k"><b>62 %</b><span class="xhy-bar"><i style="width:62%"></i></span><small>280 km · 10.280 km</small></div><div class="xhy-img">'+carImg()+'</div>'+
      '<div class="xhy-q"><span><i>'+svg("fan")+'</i>Clima</span><span><i>'+svg("lock")+'</i>Bloquear</span><span><i>'+svg("window")+'</i>Janela</span><span class="'+(c.h?"hl":"")+'"><i>'+svg("bolt")+'</i>'+esc(c.l)+'</span></div></div>'+
      '<div class="xhy-s">'+svg("search")+'<span>Pesquisa</span><i>'+svg("send")+'</i></div><div class="xhy-w">'+svg("cloud")+'<b>14°</b><small>Nublado · Lisboa</small></div>';
  },
  "x-mazda":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name;
    return '<div class="xmz"><div class="xmz-img">'+carImg()+'</div><div class="xmz-in"><b>'+esc(fam)+'</b><div class="xmz-k">'+svg("bat")+'62 %<span class="xmz-bar"><i style="width:62%"></i></span>280 km</div>'+
      '<div class="xmz-q"><i>'+svg("lock")+'</i><i>'+svg("power")+'</i><i>'+svg("hazard")+'</i><i>'+svg("light")+'</i></div></div></div>'+
      L.map(x=>'<div class="xmz-r'+(x.h?" hl":"")+'">'+svg("bolt")+'<span>'+esc(x.l)+(x.sub?'<small>'+esc(x.sub)+'</small>':'')+'</span>'+svg("chev")+'</div>').join("")+
      '<div class="xmz-r">'+svg("pin")+'<span>Mapa</span>'+svg("chev")+'</div><div class="xmz-sec">AVISOS</div><div class="xmz-n">'+svg("hazard")+'<span>Alerta de manutenção</span><em>Detalhe</em></div>';
  },
  "x-nissan":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name;
    return '<div class="xns"><b class="xns-nm">'+esc(fam)+svg("chev")+'</b><div class="xns-img">'+carImg()+'</div><small class="xns-rg">Autonomia estimada: <b>280 km</b></small><div class="xns-q"><i>'+svg("lock")+'</i><i>'+svg("unlock")+'</i><i>'+svg("more")+'</i></div></div>'+
      L.map(x=>'<div class="xns-c'+(x.h?" hl":"")+'">'+svg("bat")+'<span>'+esc(x.l)+(x.sub?'<small>'+esc(x.sub)+'</small>':'')+'</span><em>62 %</em>'+svg("chev")+'</div>').join("")+
      '<div class="xns-c">'+svg("car")+'<span>Estado do veículo<small>Sem problemas</small></span>'+svg("chev")+'</div><div class="xns-c">'+svg("gauge")+'<span>Monitorização<small>Alerta de velocidade ativo</small></span>'+svg("chev")+'</div>';
  },
  "x-opel":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, ic=["plug","fan"];
    let sg=""; for(let j=0;j<5;j++) sg+='<i class="'+(j<3?"on":"")+'"></i>';
    const B=L.map((x,j)=>'<div class="'+(x.h?"hl":"")+'">'+svg(ic[j]||"grid")+esc(x.l)+'</div>');
    if(B.length<2) B.push('<div>'+svg("phone")+'Contacto &amp; assistência</div>');
    return '<div class="xop"><div class="xop-hd"><b>Opel <em>'+esc(fam)+'</em>'+svg("chev")+'</b><span>'+svg("shield")+svg("user")+'</span></div><div class="xop-tb"><i class="on">'+svg("home")+'</i><i>'+svg("gauge")+'</i><i>'+svg("wrench")+'</i><i>'+svg("car")+'</i></div>'+
      '<div class="xop-img">'+carImg()+'</div><div class="xop-k"><div><small>Bateria</small><span class="xop-sg">'+sg+'</span><b>280 km</b></div><div><small>Consumo médio /7 dias</small><b>15,2</b></div><div><small>Km total</small><b>3 244 km</b></div></div></div>'+
      '<div class="xop-b">'+B.join("")+'</div><div class="xop-map"><i></i></div><div class="xop-nw">NOVIDADES MYOPEL</div>';
  },
  "x-peugeot":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, ic=["plug","fan"];
    let sg=""; for(let j=0;j<5;j++) sg+='<i class="'+(j<3?"on":"")+'"></i>';
    return '<div class="xpe"><div class="xpe-hd"><b>Peugeot <em>'+esc(fam)+'</em>'+svg("chev")+'</b><span>'+svg("pin")+svg("user")+'</span></div><div class="xpe-tb"><i class="on">'+svg("home")+'</i><i>'+svg("route")+'</i><i>'+svg("wrench")+'</i><i>'+svg("info")+'</i></div>'+
      '<small class="xpe-up">Última atualização: hoje, às 21:55</small><div class="xpe-img">'+carImg()+'</div><div class="xpe-k"><div><small>Bateria</small><span class="xpe-sg">'+sg+'</span><b>280 km</b></div><div><small>Consumo médio /7D</small><b>15,2</b></div><div><small>Km total</small><b>9 356</b></div></div></div>'+
      L.map((x,j)=>'<div class="xpe-b'+(x.h?" hl":"")+'">'+svg(ic[j]||"grid")+esc(x.l)+'</div>').join("")+
      '<div class="xpe-map"><i></i></div><div class="xpe-nw">UNIVERSO PEUGEOT</div>';
  },
  "x-skoda":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{l:"Bateria",h:0};
    return '<div class="xsk"><div class="xsk-hd"><b>'+svg("cars")+esc(fam)+'</b>'+svg("bell")+'</div><small class="xsk-up">Atualizado pelo carro há 2 minutos</small><span class="xsk-on"><i></i>Online</span><div class="xsk-img">'+carImg()+'</div></div>'+
      '<div class="xsk-c st">'+svg("lock")+'<span>Estado do veículo<small>Trancado</small></span><i class="xsk-tg"></i></div>'+
      '<div class="xsk-c'+(c.h?" hl":"")+'"><div class="xsk-bh"><span>'+esc(c.l)+'</span>'+svg("chev")+'</div><div class="xsk-bv">62 %<small>/ 280 km</small></div><span class="xsk-bar"><i style="width:62%"></i></span><div class="xsk-bm"><span>'+svg("bolt")+'80 % | Cabo ligado</span><span>'+svg("home")+'Casa</span></div></div>';
  },
  "x-toyota":(K,name,s)=>{
    const L=xLinks(s), c=L[0]||{l:"Carregamento",sub:"",h:0};
    return '<div class="xty"><span class="xty-pill">A minha garagem</span><div class="xty-img">'+carImg()+'</div><div class="xty-k"><div><b>2.340,8 km</b><small>Quilometragem</small></div><span class="xty-g"><svg viewBox="0 0 64 36" aria-hidden="true"><path d="M6 32a26 26 0 0 1 52 0" fill="none" stroke="#E3E3E3" stroke-width="4" stroke-linecap="round"/><path d="M6 32a26 26 0 0 1 52 0" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round" stroke-dasharray="50.6 81.7"/></svg></span><div><b>280 km</b><small>Autonomia</small></div></div>'+
      '<small class="xty-dt">Hoje às 21:55</small><span class="xty-st">'+svg("check")+'Ver estado</span></div>'+
      '<div class="xty-c'+(c.h?" hl":"")+'"><div class="xty-ch"><span>'+esc(c.l)+'</span>'+svg("more")+'</div><div class="xty-cb"><i>'+svg("plug")+'</i><span><b>62 %</b>'+esc(c.sub||"Cabo ligado")+'</span></div></div>';
  },
  "x-polestar":(K,name,s)=>{
    const L=xLinks(s), c=L[0]||{l:"Carregamento",h:0};
    return '<div class="xps"><div class="xps-top"><div class="xps-l"><b>62%</b><b>280 km</b><span class="xps-bar"><i style="width:62%"></i><em style="left:80%"></em></span><small>Cabo ligado</small><p>À espera</p><small>Potência</small><p>0 kW</p></div><div class="xps-img">'+carImg()+'</div></div></div>'+
      '<div class="xps-g"><div><b>Exterior</b><small>Trancado</small><em>···</em>'+svg("lock")+'</div><div><b>Climatização</b><small>Desligada</small><em>···</em>'+svg("fan")+'</div><div class="'+(c.h?"hl":"")+'"><b>'+esc(c.l)+'</b><small>Limite 80%</small><em>···</em>'+svg("bolt")+'</div><div><b>Localização</b><small>Casa</small><em>···</em>'+svg("pin")+'</div></div>';
  },
  "x-smart":(K,name,s)=>{
    const L=xLinks(s), c=L[0]||{l:"Bateria",h:0};
    return '<div class="xsm"><div class="xsm-hero"><div class="xsm-hd"><div><b>'+esc(name)+'</b><small>Estacionado · Visto às 21:55'+svg("sync")+'</small></div><span class="xsm-av">'+svg("user")+'</span></div><b class="xsm-km">280 <small>km</small></b><div class="xsm-img">'+carImg()+'</div>'+
      '<div class="xsm-q"><i>'+svg("key")+'</i><i>'+svg("lock")+'</i><i>'+svg("pin")+'</i><i>'+svg("trunk")+'</i><i>'+svg("plus")+'</i></div></div></div>'+
      '<div class="xsm-c">'+svg("key")+'<span>Chaves digitais</span><em>Gerir</em></div>'+
      '<div class="xsm-c'+(c.h?" hl":"")+'">'+svg("bolt")+'<span>'+esc(c.l)+'<small>280 km · 62 % · <i></i>Cabo ligado</small></span>'+svg("chev")+'</div>'+
      '<div class="xsm-c">'+svg("fan")+'<span>Temperatura do ar<small>Interior 18 °C</small></span>'+svg("chev")+'</div>';
  },
  "x-tesla":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, ic={"Controlos":"car","Climatização":"fan","Carregamento":"bolt","Localização":"pin"}, ch=L.find(x=>x.l==="Carregamento");
    return '<div class="xte"><div class="xte-hd"><div><b>'+esc(fam)+'</b><span class="xte-bt">'+svg("bat")+'280 km</span><small>Estacionado</small></div>'+svg("menu")+'</div><div class="xte-img">'+carImg()+'</div>'+
      '<div class="xte-q"><i>'+svg("lock")+'</i><i class="on">'+svg("fan")+'</i><i class="'+(ch&&ch.h?"hl":"")+'">'+svg("bolt")+'</i><i>'+svg("car")+'</i></div></div>'+
      L.map(x=>'<div class="xte-r'+(x.h?" hl":"")+'">'+svg(ic[x.l]||"grid")+'<span>'+esc(x.l)+(x.sub?'<small>'+esc(x.sub)+'</small>':'')+'</span>'+svg("chev")+'</div>').join("");
  },
  "x-vw":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{l:"Carregamento",h:0};
    return '<div class="xvw"><div class="xvw-hd"><b>My '+esc(fam)+'</b>'+svg("plus")+'</div><div class="xvw-img">'+carImg()+'</div>'+
      '<div class="xvw-k"><div class="xvw-ch'+(c.h?" hl":"")+'"><i></i><b>280<small>km</small></b><small>62 % · Cabo ligado</small></div><div class="xvw-ac">'+svg("fan")+'<b>Desligado</b><small>Ar condicionado</small></div></div></div>'+
      '<div class="xvw-l"><div>'+svg("car")+'<span>Veículo</span>'+svg("chev")+'</div><div>'+svg("clock")+'<span>Horas de partida</span>'+svg("chev")+'</div><div>'+svg("hazard")+'<span>Relatório de estado do veículo</span>'+svg("chev")+'</div><div>'+svg("route")+'<span>Dados de condução</span>'+svg("chev")+'</div></div>';
  },
  "x-volvo":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{l:"Carregamento",sub:"",h:0};
    return '<div class="xvo"><div class="xvo-hd"><span class="xvo-pl">'+esc(fam)+svg("chev")+'</span><i>'+svg("bell")+'</i></div><b class="xvo-k">280 km<br>62%</b><div class="xvo-img">'+carImg()+'</div>'+
      '<div class="xvo-st'+(c.h?" hl":"")+'"><span>'+svg("plug")+esc(c.l)+'</span><small>'+esc(c.sub||"Cabo ligado")+'</small></div></div>'+
      '<div class="xvo-q"><i>'+svg("trunk")+'</i><i>'+svg("fan")+'</i><i>'+svg("lock")+'</i><i>'+svg("more")+'</i></div>';
  },
  "x-xpeng":(K,name,s)=>{
    const L=xLinks(s), c=L[0]||{l:"Carregamento",sub:"",h:0};
    return '<div class="xxp"><div class="xxp-hd"><div class="xxp-k"><b>280</b><span><small>WLTP</small>km</span><em>62%</em></div><span>'+svg("qr")+svg("gear")+'</span></div><span class="xxp-bar"><i style="width:62%"></i></span><small class="xxp-st"><i></i>Trancado</small>'+
      '<div class="xxp-img">'+carImg()+'</div><div class="xxp-q"><span>'+svg("lock")+'Trancar</span><span>'+svg("window")+'Janelas</span><span class="on">'+svg("trunk")+'Bagageira</span></div></div>'+
      '<div class="xxp-c2"><div><b>Chave digital'+svg("chev")+'</b><small>Não ligada</small><p><span>'+svg("power")+'Ligar</span><span>'+svg("car")+'Estacionar</span></p></div><div><b>Encontrar veículo'+svg("chev")+'</b><small>Casa</small><p><span>'+svg("horn")+'Buzina</span><span>'+svg("light")+'Luzes</span></p></div></div>'+
      '<div class="xxp-r'+(c.h?" hl":"")+'">'+svg("bolt")+'<span>'+esc(c.l)+(c.sub?'<small>'+esc(c.sub)+'</small>':'')+'</span>'+svg("chev")+'</div>';
  },
  "x-zeekr":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{l:"Controlo de energia",h:0};
    return '<div class="xzk"><b class="xzk-nm">ZEEKR '+esc(fam.toUpperCase())+svg("sync")+'</b><b class="xzk-p">62<small>%</small></b><span class="xzk-bar"><i style="width:62%"></i></span><small class="xzk-st">280 km · Estacionado</small><div class="xzk-img">'+carImg()+'</div></div>'+
      '<div class="xzk-c"><div class="xzk-q"><i class="or">'+svg("unlock")+'</i><i>'+svg("fan")+'</i><i class="'+(c.h?"hl":"")+'" aria-label="'+esc(c.l)+'">'+svg("bolt")+'</i><i>'+svg("trunk")+'</i></div><div class="xzk-rc"><span>Controlos remotos</span>'+svg("chev")+'</div></div>'+
      '<div class="xzk-map"><b>Carro estacionado</b><small>Perto de casa · 50 m</small><i>'+svg("nav")+'</i></div>';
  },
  "x-merc":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{h:0};
    return '<div class="xmb"><div class="xmb-hd">'+svg("cars")+'<b>Mercedes-Benz</b>'+svg("user")+'</div><div class="xmb-hero"><b>'+esc(fam)+'</b><small>3.680 km · '+svg("lock")+'Trancado</small><small class="xmb-up">'+svg("sync")+'Atualizado hoje às 21:55</small><div class="xmb-img">'+carImg()+'</div><span class="xmb-dots"><i class="on"></i><i></i><i></i></span></div></div>'+
      '<div class="xmb-bt'+(c.h?" hl":"")+'"><b>'+svg("bat")+'280 km · 62 %</b><span class="xmb-bar"><i style="width:62%"></i><em style="left:80%"></em></span></div>'+
      '<div class="xmb-rc"><div class="xmb-rh"><b>Controlos remotos</b><span>Personalizar</span></div><div class="xmb-t">'+[["lock","Trancado"],["door","Fechadas"],["window","Fechado"],["fan","Desligada"]].map(x=>'<span><i>'+svg(x[0])+'</i>'+x[1]+'</span>').join("")+'</div></div>';
  },
  "x-mg":(K,name,s)=>{
    const L=xLinks(s), ic=["bat","fan"];
    return '<div class="xg"><div class="xg-hd"><b>O meu carro'+svg("sync")+'</b>'+svg("bell")+'</div><div class="xg-rg"><b>280</b><small>km<br>Autonomia total</small></div><div class="xg-img">'+carImg()+'</div>'+
      '<div class="xg-q">'+[["lock","Trancar",0],["unlock","Destrancar",1],["window","Janelas",0],["sun","Teto",0]].map(x=>'<span'+(x[2]?' class="on"':'')+'><i>'+svg(x[0])+'</i>'+x[1]+'</span>').join("")+'</div>'+
      '<div class="xg-ks">'+svg("key")+'Arranque sem chave</div></div>'+
      '<div class="xg-g">'+L.map((x,j)=>'<div class="xg-c'+(x.h?" hl":"")+'"><span>'+svg(ic[j]||"grid")+esc(x.l)+'</span><b>'+esc(x.sub)+'</b></div>').join("")+'</div>';
  },
  "x-mini":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{h:0};
    return '<div class="xn"><div class="xn-hd">'+svg("bell")+'<b>'+esc(fam)+'</b>'+svg("car")+'</div><b class="xn-ok">TUDO<br>OK</b><small class="xn-up">Atualizado a partir do veículo · 21:55</small><span class="xn-cs">Verificar estado</span>'+
      '<div class="xn-row"><div class="xn-soc'+(c.h?" hl":"")+'"><small>Estado de carga</small><b>'+svg("bolt")+'62 %</b><b>'+svg("pin")+'280 km</b></div><svg class="xn-arc" viewBox="0 0 84 44" aria-hidden="true"><path d="M6 40a36 36 0 0 1 72 0" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="5"/><path d="M6 40a36 36 0 0 1 58-28" fill="none" stroke="#F4C430" stroke-width="5" stroke-linecap="round"/></svg></div>'+
      '<div class="xn-img">'+carImg()+'</div></div>'+
      '<div class="xn-q">'+["lock","unlock","light","horn","fan"].map(k=>svg(k)).join("")+'</div>'+
      '<div class="xn-c"><div>'+svg("pin")+'Localizar veículo</div><div>'+svg("clock")+'Histórico remoto</div></div>';
  },
  "x-alp":(K,name,s)=>{
    const L=xLinks(s), fam=K.full?name:(famName()||name);
    return '<div class="xa"><div class="xa-hd"><b>'+esc(fam)+'</b>'+svg("bell")+'</div><div class="xa-img">'+carImg()+'</div><div class="xa-rg"><b>280<small> km</small></b><span class="xa-bar"><i style="width:62%"></i></span><small>62 % · Cabo ligado</small></div></div>'+
      '<div class="xa-q">'+[["horn","Buzina"],["light","Acender luzes"],["fan","Climatização"]].map(x=>'<span>'+svg(x[0])+x[1]+'</span>').join("")+'</div>'+
      '<div class="xa-sec">Carregamento e climatização</div>'+
      L.map(x=>'<div class="xa-r'+(x.h?" hl":"")+'"><i>'+svg("clock")+'</i><span>'+esc(x.l)+(x.sub?'<small>'+esc(x.sub)+'</small>':'')+'</span>'+svg("chev")+'</div>').join("");
  },
  "x-bent":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{l:"Carregamento",h:0};
    return '<div class="xe"><div class="xe-hd">PAINEL</div><div class="xe-car"><span>'+svg("back")+'</span><div class="xe-img">'+carImg()+'</div><span>'+svg("chev")+'</span></div><div class="xe-gm">Boa noite</div><b class="xe-nm">'+esc(fam.toUpperCase())+'</b><small>Última ligação: hoje às 21:55</small>'+
      '<div class="xe-lk"><i>'+svg("lock")+'</i><i>'+svg("unlock")+'</i></div><small class="xe-st">O Bentley está trancado</small></div>'+
      '<div class="xe-rg'+(c.h?" hl":"")+'">'+ringHTML(62)+'<div><b>280 km</b><small>'+esc(c.l)+'</small></div>'+svg("chev")+'</div>'+
      '<div class="xe-cl"><div><small>Quilometragem</small><b>3.680 km</b></div><div><small>Luzes</small><b>Desligadas</b></div></div>';
  },
  "x-bmw":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{h:0};
    return '<div class="xw"><div class="xw-hd">'+svg("bell")+'<b>'+esc(fam)+'</b>'+svg("car")+'</div><b class="xw-ok">TUDO<br>OK</b><div class="xw-img">'+carImg()+'</div></div>'+
      '<div class="xw-g"><div class="xw-c"><b>Estado</b><small>Tudo OK</small><span>'+svg("lock")+svg("shield")+'</span></div><div class="xw-c'+(c.h?" hl":"")+'"><b>Estado de carga</b><small>62 %</small><span>'+svg("bat")+'<em>280 km</em></span></div></div>'+
      '<div class="xw-q"><i class="on">'+svg("lock")+'</i><i>'+svg("unlock")+'</i><i>'+svg("car")+'</i><i>'+svg("light")+'</i></div>'+
      '<div class="xw-g"><div class="xw-c"><b>Climatização</b><small>Desligada</small><span>'+svg("fan")+'</span></div><div class="xw-c"><b>Comandos</b><small>Acesso remoto</small><span>'+svg("car")+'</span></div></div>';
  },
  "x-gwm":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{l:"Programa de carregamento",h:0};
    return '<div class="xo"><div class="xo-hd"><b>O meu '+esc(fam.replace(/\s*\(.*\)/,""))+svg("chev","xo-dn")+'</b>'+svg("bell")+'</div>'+
      '<div class="xo-rg'+(c.h?" hl":"")+'"><b>280<small>km de autonomia</small></b><span class="xo-bar"><i style="width:62%"></i></span><span class="xo-cp">'+svg("bolt")+esc(c.l)+' ›</span></div><div class="xo-img">'+carImg()+'</div></div>'+
      '<div class="xo-qc"><b>Controlo rápido</b><div>'+[["lock","Trancar"],["window","Janelas"],["trunk","Mala"],["light","Luzes"]].map(x=>'<span><i>'+svg(x[0])+'</i>'+x[1]+'</span>').join("")+'</div></div>'+
      '<div class="xo-g"><div><small>Ar condicionado</small><b>24 °C</b></div><div><small>Bancos</small><b>Desligados</b></div></div>';
  },
  "x-honda":(K,name,s)=>{
    const fam=famName()||name;
    return '<div class="xh"><div class="xh-hd"><b>My Honda '+esc(fam)+'</b><span>'+svg("car")+svg("menu")+'</span></div><small>'+svg("sync")+'Atualizado há 1 min · '+svg("pin")+'Lisboa</small>'+
      '<div class="xh-k"><span class="xh-bt"><i style="width:62%"></i></span><div><small>km restantes</small><b>280</b></div><div><small>Interior</small><b>20 °C</b></div></div>'+
      '<div class="xh-st"><span>'+svg("fan")+'Climatização</span><div><div class="xh-loc">'+svg("pin")+'Localizar</div><div class="xh-ring"><div class="xh-img">'+carImg()+'</div></div></div><span>'+svg("horn")+'Buzina</span></div>'+
      '<div class="xh-b"><span><i>'+svg("unlock")+'</i>Destrancado</span><span><i>'+svg("plug")+'</i>A carregar</span></div></div>';
  },
  "x-jeep":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{h:0};
    return '<div class="xje"><div class="xje-hd"><b>'+esc(fam)+svg("chev","xje-dn")+'</b><span>'+svg("bell")+svg("menu")+'</span></div><div class="xje-img">'+carImg()+'</div></div>'+
      '<div class="xje-g"><div class="xje-c xje-rg'+(c.h?" hl":"")+'"><b>280</b><small>km estimados</small><span class="xje-bars">'+[9,13,17,21,24].map((h,j)=>'<i style="height:'+h+'px'+(j>3?';opacity:.25':'')+'"></i>').join("")+'</span></div>'+
      '<div class="xje-c xje-ok"><i>'+svg("check")+'</i><b>Bom</b><small>Estado do veículo</small></div></div>'+
      '<div class="xje-c xje-lk"><span>'+svg("unlock")+'Destrancar</span><span>'+svg("lock")+'Trancar</span></div><div class="xje-btn">Procurar carregamento</div>';
  },
  "x-mas":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{h:0};
    return '<div class="xm"><div class="xm-hd"><b>'+esc(fam)+'</b><span>'+svg("bell")+svg("menu")+'</span></div><div class="xm-img">'+carImg()+'</div></div>'+
      '<div class="xm-g"><div class="xm-c'+(c.h?" hl":"")+'"><svg class="xm-gg" viewBox="0 0 40 40" aria-hidden="true"><circle class="t" cx="20" cy="20" r="16" fill="none" stroke="#E2E2E2" stroke-width="3"/><circle class="v" cx="20" cy="20" r="16" fill="none" stroke="#2DB34A" stroke-width="3" stroke-dasharray="62 101" transform="rotate(-90 20 20)"/></svg><b>280</b><small>km · autonomia</small></div>'+
      '<div class="xm-c xm-ok"><i>'+svg("check")+'</i><b>Tudo OK</b><small>Estado do veículo</small></div>'+
      '</div><div class="xm-c xm-lk"><span>'+svg("unlock")+'Destrancar</span><span>'+svg("lock")+'Trancar</span><span>'+svg("light")+'Luzes</span></div>';
  },
  "x-kia":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{h:0};
    return '<div class="xk"><div class="xk-nm">'+esc(fam)+svg("chev","xk-dn")+'</div><div class="xk-pc"><b>62</b><small>%</small></div><span class="xk-bar"><i style="width:62%"></i></span><small class="xk-km">280 km · 5.322 km</small><div class="xk-img">'+carImg()+'</div>'+
      '<div class="xk-q"><i>'+svg("fan")+'</i><i>'+svg("lock")+'</i><i>'+svg("door")+'</i><i class="xk-b'+(c.h?" hl":"")+'">'+svg("bolt")+'</i></div>'+
      '<div class="xk-w">'+svg("sun")+'<b>18 °C</b><span>Lisboa</span></div></div>';
  },
  "x-leap":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{l:"Centro de carregamento",h:0};
    return '<div class="xl"><div class="xl-hd"><b>O meu '+esc(fam)+svg("chev","xl-dn")+'</b><small>Atualizado: 21:55</small></div><div class="xl-rg"><b>280<small>km</small></b><i class="xl-bt"><em style="width:62%"></em></i><span>'+svg("lock")+'Portas trancadas</span></div>'+
      '<span class="xl-cc'+(c.h?" hl":"")+'">'+svg("bolt")+esc(c.l)+svg("chev")+'</span><div class="xl-img">'+carImg()+'</div><small class="xl-pk">Estacionado</small>'+
      '<div class="xl-q">'+[["unlock","Destrancar"],["lock","Trancar"],["trunk","Bagageira"],["window","Janelas"]].map(x=>'<span><i>'+svg(x[0])+'</i>'+x[1]+'</span>').join("")+'</div>'+
      '<div class="xl-cl"><div><b>22<small>°C</small></b><small>Temperatura interior 24 °C</small></div><i>'+svg("fan")+'</i></div></div>';
  },
  "x-lexus":(K,name,s)=>{
    const L=xLinks(s), c=L[0]||{h:0};
    return '<div class="xx"><span class="xx-g">A minha garagem</span><div class="xx-img">'+carImg()+'</div>'+
      '<div class="xx-k"><div><b>3.680 km</b><small>Quilometragem</small></div><div class="xx-bt'+(c.h?" hl":"")+'">'+svg("bat")+'<b>62 %</b></div><div><b>280 km</b><small>Autonomia</small></div></div>'+
      '<small class="xx-up">Ontem às 21:55</small><span class="xx-vs">'+svg("check")+'Ver estado</span>'+
      '<div class="xx-rc"><b>LIGAÇÃO REMOTA<span>'+svg("more")+'</span></b><i>'+svg("fan")+'</i></div></div>';
  },
  "x-lotus":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name, c=L[0]||{l:"Definições de energia",h:0}, cl=L[1];
    return '<div class="xt"><div class="xt-hd"><div><b>O meu '+esc(fam)+svg("chev")+'</b><small>Atualizado: 21:55</small></div><span>'+svg("help")+svg("bell")+svg("qr")+'</span></div><div class="xt-img">'+carImg()+'</div><small class="xt-st">Estado do carro ›</small>'+
      '<div class="xt-q">'+[["lock","Trancar",0],["fan","A/C",1],["window","Janelas",0],["trunk","Mala",0]].map(x=>'<span'+(x[2]?' class="on"':'')+'>'+svg(x[0])+x[1]+'</span>').join("")+'</div>'+
      '<div class="xt-g"><div class="xt-c'+(c.h?" hl":"")+'"><small>'+esc(c.l)+'</small><b>62<small>%</small></b><small>280 km</small><span class="xt-bar"><i style="width:62%"></i></span></div>'+
      '<div class="xt-c"><small>'+esc(cl?cl.l:"Climatização")+'</small><b>22,0<small>°C</small></b><small>Interior</small></div><div class="xt-c xt-s"><small>Gerir condutor</small></div><div class="xt-c xt-s"><small>Mais</small></div></div></div>';
  },
  "x-lucid":(K,name,s)=>{
    const L=xLinks(s), fam=famName()||name;
    return '<div class="xu"><div class="xu-cd"><div class="xu-hd"><b>Lucid '+esc(fam)+svg("chev","xu-dn")+'</b><span class="xu-bt">'+svg("bat")+'62 %</span></div><small class="xu-pk">Estacionado '+svg("pin")+'</small><div class="xu-img">'+carImg()+'</div>'+
      '<div class="xu-q"><i class="on">'+svg("lock")+'</i><i>'+svg("trunk")+'</i><i>'+svg("car")+'</i><i>'+svg("horn")+'</i></div></div>'+
      L.map((x,j)=>'<div class="xu-r'+(x.h?" hl":"")+'">'+svg(j?"fan":"bolt")+'<span>'+esc(x.l)+(x.sub?'<small> · '+esc(x.sub)+'</small>':'')+'</span>'+svg("chev")+'</div>').join("")+'</div>';
  },
  "x-lynk":(K,name,s)=>{
    const L=xLinks(s), ic=["bolt","fan","door"];
    return '<div class="xy"><div class="xy-hd"><span class="xy-pl">AB-12-CD</span>'+svg("bt")+'</div><div class="xy-img">'+carImg()+'</div>'+
      '<div class="xy-lk"><i class="on">'+svg("lock")+'</i><i>'+svg("unlock")+'</i></div>'+
      L.map((x,j)=>'<div class="xy-r'+(x.h?" hl":"")+'">'+svg(ic[j]||"grid")+'<span>'+esc(x.l)+(j===0?'<small>62 % · 280 km</small><span class="xy-pb"><i style="width:62%"></i></span>':(x.sub?'<small>'+esc(x.sub)+'</small>':''))+'</span>'+svg("chev")+'</div>').join("")+'</div>';
  },
  "x-jag":(K,name,s)=>{
    const L=xLinks(s), ic={"Carregamento":"bolt","Remote":"phone","Localização":"pin","Segurança":"shield"};
    return '<div class="xj"><div class="xj-hd"><div><b>'+esc(name)+'</b><small>'+svg("lock")+'Trancado - há 5 min.</small><small>'+svg("bat")+'62% 280 km</small></div>'+svg("user")+'</div><div class="xj-img">'+carImg()+'</div>'+
      '<div class="xj-q"><i>'+svg("fan")+'</i><i>'+svg("light")+'</i></div>'+
      L.map(x=>'<div class="xj-c'+(x.h?" hl":"")+'">'+svg(ic[x.l]||"grid")+'<span>'+esc(x.l)+(x.sub?'<small>'+esc(x.sub)+'</small>':'')+'</span>'+svg("chev")+'</div>').join("")+'</div>';
  }
};
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
  if(home&&XH[K.home]) return XH[K.home](K,name,s);
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
const SKIN_DEF={home:"dash",list:"card",hd:"l",sw:"ios",time:"chip",day:"circle",btn:"fill",batt:"bar",seg:"pill",r:"14px",br:"999px",tabs:4,ind:"plain",quick:"",tw:700,ff:FONT.rob,hf:FONT.rob};
function appLabel(k,T,b){return k==="wb"?"App da wallbox":(b.app||T.name||"App da marca");}
function deviceHTML(g,b,p){
  const s=g.screens[MS.screen], {k,T,key}=themeFor(g,s,b); MS.p=p;
  const K=Object.assign({},SKIN_DEF,(typeof SKIN!=="undefined"&&SKIN[key])||{});
  const fam=MS.family?(b.name==="Smart"&&/^\d$/.test(MS.family.name)?"#"+MS.family.name:MS.family.name):"";
  const name=b.other?"O carro":(fam?(K.short?fam:(b.name==="Smart"?"smart "+fam:b.name+" "+fam)):b.name);
  const home=s.rows.length&&s.rows[0][0]==="hero";
  const band=!!(K.band&&T.hd);
  const acct=contrast(T.acc,T.bg)<2.6?T.fg:T.acc;
  const rs=Math.min(parseFloat(K.r)||0,8)+"px";
  const vars="--bg:"+T.bg+";--card:"+T.card+";--fg:"+T.fg+";--mut:"+T.mut+";--line:"+T.line+";--acc:"+T.acc+";--on:"+T.on+";--acct:"+acct+
    ";--hd:"+(T.hd||T.bg)+";--hdfg:"+(T.hdfg||T.fg)+";--r:"+K.r+";--rs:"+rs+";--br:"+K.br+";--tw:"+K.tw+";--ff:"+K.ff+";--hf:"+(K.hf||K.ff)+
    ";--chip:"+rgba(T.fg,T.dark?.1:.06)+";--pill:"+rgba(acct,.16)+";--ringc:"+(K.ringc||"#34C759")+(T.swc?";--swc:"+T.swc:"");
  const showTabs=k==="app"&&!!K.tabs&&(home||s.tab!=null), tabOn=s.tab!=null?s.tab:0;
  const cls="dev phone sk-"+key+(T.dark?" dark":" light")+" l-"+K.list+" hd-"+K.hd+" sw-"+K.sw+" tm-"+K.time+" dy-"+K.day+" bt-"+K.btn+" sg-"+K.seg+" ind-"+K.ind+(K.up?" up":"")+(band?" band":"")+(s.btn?" has-btn":"")+(s.rows.length&&s.rows[0][0]==="batt"?" top-batt":"")+((s.hl||[]).length?" spot":"")+(showTabs?" has-tabs":"")+(home?" is-home h-"+K.home:"")+(s.tab!=null?" is-tab":"");
  const sb='<div class="m-sb"><span>21:58</span><span class="isl"></span>'+SB_ICONS+'</div>';
  const nav=home?"":'<div class="m-nav">'+(MS.screen>0&&s.tab==null?'<span class="m-back">'+svg("back")+'</span>':'')+'<b>'+esc(s.t||appLabel(k,T,b))+'</b>'+(s.act?'<span class="m-act'+(s.hlAct?" hl":"")+'">'+svg(s.act)+'</span>':'')+'</div>';
  const top='<div class="m-top">'+sb+(home&&K.home==="band"?heroHTML(K,name):nav)+'</div>';
  const labels=K.tabsL||TAB_DEF;
  const tabs=showTabs?'<div class="m-tabs'+(K.tabsL&&!K.tabsNoL?"":" nol")+'">'+labels.slice(0,K.tabs).map((l,j)=>'<span class="'+(j===tabOn?"on":"")+(j===s.hlTab?" hl":"")+'"><i>'+svg(TAB_IC[l.replace(/\u2060/g,"")]||"grid")+'</i><em>'+esc(l)+'</em></span>').join("")+'</div>':"";
  const btn=s.btn?'<div class="m-btn'+(s.hlBtn?" hl":"")+'"><span>'+esc(s.btn)+'</span></div>':"";
  const toast=s.toast?'<div class="m-toast'+(!btn&&!tabs?" end":"")+'"><span class="m-tic">'+svg(s.toast[0])+'</span><span>'+esc(fillT(s.toast[1],p))+'</span></div>':"";
  let sheet="";
  if(s.sheet){
    const v=s.sheet.v==="E"?p.e:s.sheet.v==="S"?p.s:String(s.sheet.v), hh=parseInt(v,10)||0, mm=(v.split(":")[1]||"00");
    const hr=d=>String((hh+d+24)%24).padStart(2,"0")+":"+mm;
    sheet='<div class="m-sheet"><div class="m-sh"><span class="m-grab"></span><b class="m-sht">'+esc(s.sheet.l)+'</b><div class="m-wheel"><span>'+hr(-2)+'</span><span>'+hr(-1)+'</span><span class="on">'+esc(v)+'</span><span>'+hr(1)+'</span><span>'+hr(2)+'</span></div><div class="m-shb"><span>OK</span></div></div></div>';
  }
  return '<div class="'+cls+(s.hlBtn||s.toast?" spot":"")+(s.sheet?" has-sheet":"")+'" style="'+vars+'"><div class="scr">'+top+'<div class="m-body">'+bodyHTML(s,K,p,name)+'</div>'+toast+btn+tabs+sheet+'<span class="m-hi"></span></div></div>';
}
const slug=s=>norm(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function shotFor(gk,b,i){
  if(typeof SHOTS==="undefined"||!SHOTS.base||!SHOTS.files.length||b.other) return null;
  const f1=slug(b.name)+"-"+gk+"-"+(i+1)+".webp", f2=gk+"-"+(i+1)+".webp";
  const f=SHOTS.files.indexOf(f1)>-1?f1:SHOTS.files.indexOf(f2)>-1?f2:null;
  return f?SHOTS.base.replace(/\/?$/,"/")+f:null;
}


/* ===================== Exportações ===================== */
const setMS = o => { MS = o; };
/* Iniciais dos dias da semana nas maquetas (por idioma) */
const setDays = a => { if (Array.isArray(a) && a.length === 7) DAYS.splice(0, 7, ...a); };
/* Ligações para as duas lojas (Google Play e App Store), no idioma escolhido */
function storeLinks(app, hl, cc) {
  const s = app && STORES[app]; if (!s) return null;
  return {
    google: s[0] ? "https://play.google.com/store/apps/details?id=" + s[0] + "&hl=" + hl : "https://play.google.com/store/search?q=" + encodeURIComponent(app) + "&c=apps&hl=" + hl,
    apple: s[1] ? "https://apps.apple.com/" + cc + "/app/id" + s[1] : "https://apps.apple.com/" + cc + "/iphone/search?term=" + encodeURIComponent(app),
  };
}
export { BRANDS, GUIDES, ALIAS, TOP, norm, initials, logoUrl, photoFor, evUrl, STORE, deviceHTML, DEVICE_CSS, themeFor, appLabel, SKIN, shotFor, CAR_SVG, LOGO, setMS, setDays, storeLinks };
