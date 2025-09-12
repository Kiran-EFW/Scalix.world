; Scalix Installer Configuration
; This file provides custom installer settings for a professional Windows installation experience

!define APPNAME "Scalix"
!define COMPANYNAME "Scalix"
!define DESCRIPTION "Free, local, open-source AI app builder"
!define VERSIONMAJOR 0
!define VERSIONMINOR 21
!define VERSIONBUILD 0
!define HELPURL "https://www.scalix.world/"
!define UPDATEURL "https://github.com/scalix-world/scalix/releases"
!define ABOUTURL "https://www.scalix.world/"
!define INSTALLSIZE 100000

RequestExecutionLevel admin
InstallDir "$PROGRAMFILES\${APPNAME}"
Name "${APPNAME}"
outFile "${APPNAME}-setup.exe"

!include LogicLib.nsh
!include nsDialogs.nsh
!include WinMessages.nsh

page directory
page instfiles

!macro VerifyUserIsAdmin
UserInfo::GetAccountType
pop $0
${If} $0 != "admin" ;Require admin rights on NT4+
    messageBox mb_iconstop "Administrator rights required!"
    setErrorLevel 740 ;ERROR_ELEVATION_REQUIRED
    quit
${EndIf}
!macroend

function .onInit
    setShellVarContext all
    !insertmacro VerifyUserIsAdmin
functionEnd

section "install"
    # Files for the install directory - to build the installer, these should be in the same directory as the install script (this file)
    setOutPath $INSTDIR

    # Copy all files from the build directory
    file /r "..\out\scalix-win32-x64\*.*"

    # Create desktop shortcut
    createShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\scalix.exe" "" "$INSTDIR\scalix.exe" 0

    # Create start menu entries
    createDirectory "$SMPROGRAMS\${APPNAME}"
    createShortCut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\scalix.exe" "" "$INSTDIR\scalix.exe" 0
    createShortCut "$SMPROGRAMS\${APPNAME}\Uninstall ${APPNAME}.lnk" "$INSTDIR\Uninstall ${APPNAME}.exe" "" "$INSTDIR\Uninstall ${APPNAME}.exe" 0

    # Registry information for add/remove programs
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$\"$INSTDIR\Uninstall ${APPNAME}.exe$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "QuietUninstallString" "$\"$INSTDIR\Uninstall ${APPNAME}.exe$\" /S"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "InstallLocation" "$\"$INSTDIR$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayIcon" "$\"$INSTDIR\scalix.exe$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "Publisher" "${COMPANYNAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "HelpLink" "${HELPURL}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLUpdateInfo" "${UPDATEURL}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLInfoAbout" "${ABOUTURL}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayVersion" "${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}"
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "VersionMajor" ${VERSIONMAJOR}
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "VersionMinor" ${VERSIONMINOR}
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoModify" 1
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoRepair" 1
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "EstimatedSize" ${INSTALLSIZE}

    # Register file associations
    WriteRegStr HKCR "scalix" "" "URL:Scalix Protocol"
    WriteRegStr HKCR "scalix" "URL Protocol" ""
    WriteRegStr HKCR "scalix\DefaultIcon" "" "$INSTDIR\scalix.exe,0"
    WriteRegStr HKCR "scalix\shell\open\command" "" "$\"$INSTDIR\scalix.exe$\" $\"%1$\""

    # Create uninstaller
    writeUninstaller "$INSTDIR\Uninstall ${APPNAME}.exe"
sectionEnd

section "uninstall"
    # Stop the application if it's running
    ExecWait '"$INSTDIR\scalix.exe" --uninstall'

    # Remove registry keys
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
    DeleteRegKey HKCR "scalix"

    # Remove files
    delete "$INSTDIR\scalix.exe"
    delete "$INSTDIR\Uninstall ${APPNAME}.exe"

    # Remove shortcuts
    delete "$DESKTOP\${APPNAME}.lnk"
    delete "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk"
    delete "$SMPROGRAMS\${APPNAME}\Uninstall ${APPNAME}.lnk"

    # Remove directories
    rmDir "$SMPROGRAMS\${APPNAME}"
    rmDir "$INSTDIR"

    # Remove user data (optional - ask user?)
    rmDir /r "$APPDATA\scalix"
sectionEnd
