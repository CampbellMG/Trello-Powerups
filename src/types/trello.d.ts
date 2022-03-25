/**
 * https://github.com/tatablack/leaner-coffee-powerup.
 * Available under the Apache-2.0 License
 */

declare global {
    export interface Window {
        Trello: Trello.Client | undefined
        TrelloPowerUp: Trello.PowerUp | undefined
        locale: string
    }
}

type TrelloIFrame = Trello.PowerUp.IFrame

export namespace Trello {
    interface Client {
        get: Client.RESTAction
        post: Client.RESTAction
        put: Client.RESTAction
        delete: Client.RESTAction
        authorize: (
            type?: "redirect" | "popup",
            name?: string,
            persist?: boolean,
            interactive?: boolean,
            scope?: {
                read: boolean
                write: boolean
                account: boolean
            },
            expiration?: "1hour" | "30days" | "never",
            success?: () => void,
            error?: () => void
        ) => void
    }

    namespace Client {
        type RESTAction<T> = (path: string, params?: unknown, success?: () => T, error?: () => void) => void
    }

    export namespace Callback {
        export type CacheAction = "run" | "retain" | "release"
        export type SerializeResult = (value: unknown, key?: string) => unknown

        export type SerializeOutput = {
            _callback: string
        }

        export interface CacheOptions {
            action: CacheAction
            options: unknown
            callback: string
        }

        export interface Cache {
            callback(t: PowerUp.IFrame, options: CacheOptions, serializeResult: SerializeResult): PromiseLike<unknown>

            serialize(fx: (t: PowerUp.IFrame, args: unknown) => unknown): SerializeOutput

            reset(): void
        }
    }

    export interface PowerUp {
        version: string
        Promise: PromiseLike<unknown>
        CallbackCache: Callback.Cache
        PostMessageIO: unknown // PostMessageIO
        iframe(options?: PowerUp.IFrameOptions): PowerUp.IFrame

        initialize(
            handlers: PowerUp.CapabilityHandlers,
            options?: PowerUp.PluginOptions
        ): PowerUp.Plugin | PowerUp.IFrame

        restApiError(): unknown

        util: PowerUp.Util
    }

    export namespace PowerUp {
        // INTERNAL TYPES
        export type ResourceDictionary = {
            [key: string]: string
        }

        export type OrganizationFields = keyof Organization
        export type BoardFields = keyof Board
        export type CardFields = keyof Card
        export type ListFields = keyof List
        export type MemberFields = keyof Member

        // USER-FACING TYPES

        export type CapabilityHandlers = {
            "attachment-sections"?: (
                t: PowerUp.IFrame,
                options: { entries: Attachment[] }
            ) => PromiseLike<(AttachmentSection | LazyAttachmentSection)[]> | AttachmentSection[]
            "attachment-thumbnail"?: (
                t: PowerUp.IFrame,
                options: AttachmentThumbnailOptions
            ) => PromiseLike<AttachmentThumbnail> | AttachmentThumbnail
            "board-buttons"?: (
                t: PowerUp.IFrame
            ) => PromiseLike<(BoardButtonUrl | BoardButtonCallback)[]> | BoardButtonCallback[]
            "card-back-section"?: (t: PowerUp.IFrame) => PromiseLike<CardBackSection> | CardBackSection
            "card-badges"?: (t: PowerUp.IFrame) => PromiseLike<(CardBadgeDynamic | CardBadge)[]> | CardBadgeDynamic[]
            "card-buttons"?: (t: PowerUp.IFrame) => PromiseLike<CardButton[]> | CardButton[]
            "card-detail-badges"?: (
                t: PowerUp.IFrame
            ) => PromiseLike<(CardDetailBadgeDynamic | CardDetailBadge)[]> | CardDetailBadgeDynamic[]
            "card-from-url"?: (
                t: Trello.PowerUp.IFrame,
                options: CardFromUrlOptions
            ) => PromiseLike<CardFromUrlResponse> | CardFromUrlResponse
            "format-url"?: (t: Trello.PowerUp.IFrame, options: FormatUrlOptions) => void
            "list-actions"?: (t: PowerUp.IFrame) => PromiseLike<ListAction[]> | ListAction[]
            "list-sorters"?: (t: PowerUp.IFrame) => PromiseLike<ListSorter[]> | ListSorter[]
            "on-enable"?: (t: PowerUp.IFrame) => PromiseLike<void>
            "on-disable"?: (t: Trello.PowerUp.IFrame) => void
            "remove-data"?: (t: Trello.PowerUp.IFrame) => void
            "save-attachment"?: (t: Trello.PowerUp.IFrame, options: unknown) => void
            "show-settings"?: (t: PowerUp.IFrame) => PromiseLike<void>
            "authorization-status"?: (t: PowerUp.IFrame, options: unknown) => PromiseLike<AuthorizationStatusResponse>
            "show-authorization"?: (t: Trello.PowerUp.IFrame) => void
        }

        export type Condition = "admin" | "always" | "edit" | "readonly" | "signedIn" | "signedOut"

        export type Model = "board" | "card" | "organization"
        export type Scope = Model | "member"
        export type Permissions = "read" | "write"

        export type Visibility = "shared" | "private"

        export interface CardFromUrlOptions {
            url: string
        }

        export interface FormatUrlOptions {
            url: string
        }

        export interface FormatUrlActions {
            text: string
            callback: (t: Trello.PowerUp.IFrame) => void
        }

        export interface CardFromUrlResponse {
            name: string
            desc: string
        }

        export interface PopupOptionsItem {
            text: string

            callback?(t: TrelloIFrame, options: unknown): PromiseLike<void>
        }

        export interface AuthorizationStatusResponse {
            authorized: boolean
        }

        export interface AttachmentThumbnail {
            title: string
            image: {
                url: string
                logo: boolean
            }
        }

        export interface AttachmentThumbnailOptions {
            url: string
        }

        export interface PopupOptions {
            title: string
            items: PopupOptionsItem[]
            mouseEvent?: MouseEvent
        }

        export interface PopupSearchOptions extends PopupOptions {
            search: {
                count?: number
                placeholder?: string
                empty?: string
                searching?: string
                debounce?: number
            }
        }

        export interface PopupIframeOptions {
            callback?(t: PowerUp.IFrame, options: { locale: string }): void

            title: string
            url: string
            args?: {
                [key: string]: unknown
            }
            height?: number
            mouseEvent?: MouseEvent
        }

        export interface PopupDateOptions {
            type: "date" | "datetime"
            title: string

            callback(
                t: PowerUp.IFrame,
                options: {
                    date: string
                }
            ): PromiseLike<void>

            date?: Date
            minDate?: Date
            maxDate?: Date
            mouseEvent: MouseEvent
        }

        export interface PopupConfirmOptions {
            type: "confirm"
            title: string
            message: string
            confirmText: string

            onConfirm(t: PowerUp.IFrame, opts: unknown): PromiseLike<void>

            confirmStyle?: "primary" | "danger"
            mouseEvent: MouseEvent
        }

        export interface PopupConfirmWithCancelOptions extends PopupConfirmOptions {
            cancelText: string

            onCancel(t: PowerUp.IFrame, opts: unknown): PromiseLike<void>
        }

        export interface HeaderAction {
            icon: string
            alt: string

            callback(): void

            position: "left" | "right"
            url?: string
        }

        export type Colors =
            | "blue"
            | "green"
            | "orange"
            | "red"
            | "yellow"
            | "purple"
            | "pink"
            | "sky"
            | "lime"
            | "light-gray"
            | "business-blue"

        export type AlertDisplay = "info" | "warning" | "error" | "success"

        // INTERNAL INTERFACES
        export interface Localizer {
            resourceDictionary: ResourceDictionary

            localize(key: string, args: readonly string[]): string
        }

        export interface Localization {
            defaultLocale: string
            supportedLocales: string[]
            resourceUrl: string
        }

        export interface LocalizerOptions {
            localizer?: Localizer

            loadLocalizer?(): PromiseLike<Localizer>

            localization?: Localization
        }

        export interface Util {
            color: {
                getHexString(): string
                namedColorStringToHex(): string
            }

            convert: {
                bytesToHexString(): string
                hexStringToUint8Array(): unknown
            }

            crypto: {
                decryptSecret(): unknown
                encryptSecret(): unknown
                exportAESCBCKeyToRaw(): unknown
                generateAESCBCKey(): unknown
                generateInitVector(): unknown
                importAESCBCKeyFromRaw(): unknown
                sha256Digest(): unknown
            }

            initLocalizer(locale: string, options: LocalizerOptions): PromiseLike<void>

            makeErrorEnum(): Error

            relativeUrl(url: string): string
        }

        export interface AnonymousHostHandlers {
            requestWithContext(command: string, options: unknown): PromiseLike<unknown>

            getAll(): PromiseLike<unknown>

            get(scope: Scope | string, visibility: Visibility, key?: string, defaultValue?: unknown): PromiseLike<any>

            set(scope: Scope | string, visibility: Visibility, key: string, value?: unknown): PromiseLike<void>

            set(
                scope: Scope | string,
                visibility: Visibility,
                entries: {
                    [key: string]: unknown
                }
            ): PromiseLike<void>

            remove(scope: Scope | string, visibility: Visibility, key: string): PromiseLike<void>

            remove(scope: Scope | string, visibility: Visibility, entries: string[]): PromiseLike<void>

            safe(html: string): string

            localizeKey(
                key: string,
                data?: {
                    [key: string]: string
                }
            ): string

            localizeKeys(keys: [string | string[]]): string[]

            localizeNode(node: Element): void

            board(...fields: ["all"] | BoardFields[]): PromiseLike<Board>

            cards(...fields: ["all"] | CardFields[]): PromiseLike<Card[]>

            lists(...fields: ["all"] | ListFields[]): PromiseLike<List[]>

            member(...fields: ["all"] | MemberFields[]): PromiseLike<Member>

            organization(...fields: ["all"] | OrganizationFields[]): PromiseLike<Organization>
        }

        export interface HostHandlers extends AnonymousHostHandlers {
            getContext(): Context

            isMemberSignedIn(): boolean

            memberCanWriteToModel(modelType: Model): boolean

            arg(name: string, defaultValue?: unknown): unknown

            signUrl(url: string, args?: { [key: string]: unknown }): string

            navigate(options: { url: string }): unknown

            showCard(idCard: string): PromiseLike<void>

            hideCard(): PromiseLike<void>

            alert(options: { message: string; duration?: number; display?: AlertDisplay }): PromiseLike<void>

            hideAlert(): PromiseLike<void>

            popup(
                options:
                    | PopupOptions
                    | PopupSearchOptions
                    | PopupIframeOptions
                    | PopupDateOptions
                    | PopupConfirmOptions
                    | PopupConfirmWithCancelOptions
            ): PromiseLike<void>

            overlay(options: { url: string; args: { [key: string]: unknown }; inset: unknown }): PromiseLike<void>

            boardBar(options: {
                url: string
                args?: { [key: string]: unknown }
                height?: number
                accentColor?: string | Colors
                callback?(t: PowerUp.IFrame): void
                title?: string
                actions?: HeaderAction[]
                resizable?: boolean
            }): PromiseLike<void>

            modal(options: {
                url: string
                accentColor?: string | Colors
                height?: number
                fullscreen?: boolean
                callback?(): void
                title?: string
                actions?: HeaderAction[]
                args?: { [key: string]: unknown }
            }): PromiseLike<void>

            updateModal(options: {
                accentColor?: string | Colors
                actions?: HeaderAction[]
                fullscreen?: boolean
                title?: string
            }): PromiseLike<void>

            closePopup(): PromiseLike<void>

            back(): PromiseLike<void>

            hideOverlay(): PromiseLike<void>

            closeOverlay(options?: { inset?: unknown }): PromiseLike<void>

            hideBoardBar(): PromiseLike<void>

            closeBoardBar(): PromiseLike<void>

            closeModal(): PromiseLike<void>

            sizeTo(arg: string | number | Element): PromiseLike<void>

            card(...fields: ["all"] | CardFields[]): PromiseLike<Card>

            list(...fields: ["all"] | ListFields[]): PromiseLike<List>

            attach(data: { name: string; url: string }): PromiseLike<void>

            requestToken(options: unknown): PromiseLike<string>

            authorize(
                authUrl: string,
                options?: {
                    height?: number
                    width?: number
                    validToken?(value: string): boolean
                }
            ): PromiseLike<string>

            storeSecret(secretKey: string, secretData: string): PromiseLike<void>

            loadSecret(secretKey: string): PromiseLike<string>

            clearSecret(secretKey: string): PromiseLike<void>

            notifyParent(
                message: "done",
                options?: {
                    targetOrigin: string
                }
            ): PromiseLike<void>
        }

        export interface IFrameOptions extends LocalizerOptions {
            context?: string
            secret?: string
            helpfulStacks?: boolean
            appKey?: string
            appName?: string
        }

        export interface IFrame extends HostHandlers {
            io: unknown | null
            args: unknown[]
            secret?: string
            options: IFrameOptions
            i18nPromise: PromiseLike<void>

            init(): unknown

            connect(): void

            request(command: string, options: unknown): PromiseLike<unknown>

            render(fxRender: () => void): unknown

            initApi(): void

            getRestApi(): {
                authorize: (props: any) => PromiseLike<string | Error>
                isAuthorized: () => PromiseLike<boolean>
                getToken: () => PromiseLike<string | null>
                clearToken: () => PromiseLike<void>
            }

            initSentry(): void

            NotHandled: unknown
        }

        export interface PluginOptions extends LocalizerOptions {
            Sentry?: {
                configureScope(
                    callback: (scope: {
                        setTags(name: string, value: string): void
                        setUser(value: { id: string }): void
                    }) => void
                ): void
            }
            appKey?: string
            appName?: string
            apiOrigin?: string
            authOrigin?: string
            localStorage?: Storage
            tokenStorageKey?: string
            helpfulStacks?: boolean
        }

        export interface Plugin extends AnonymousHostHandlers {
            options: PluginOptions

            connect(): unknown // return an instance of PostMessageIO
            request(command: string, options: unknown): PromiseLike<unknown> //  // return PostMessageIO.request, whatever that is
            init(): unknown // return an instance of PostMessageIO
            NotHandled(): unknown // return PostMessageIO.NotHandled, whatever that is
        }

        // USER-FACING INTERFACES
        export interface BoardButtonBase {
            icon: {
                dark: string
                light: string
            }
            text: string
            condition?: Condition
        }

        export interface BoardButtonCallback extends BoardButtonBase {
            callback: (t: Trello.PowerUp.IFrame) => PromiseLike<void>
        }

        export interface BoardButtonUrl extends BoardButtonBase {
            url: string
            target?: string
        }

        export interface CardBackSection {
            title: string
            icon: string
            content: {
                type: "iframe"
                url: string
                height?: number
            }
        }

        export interface CardBadge {
            text?: string
            icon?: string
            color?: Colors
            refresh?: number
        }

        export interface CardBadgeDynamic {
            dynamic(): CardBadge | Promise<CardBadge>
        }

        export interface CardDetailBadge extends CardBadge {
            callback?(t: PowerUp.IFrame): void

            url?: string
            target?: string
        }

        export interface CardDetailBadgeDynamic {
            dynamic(): CardDetailBadge | Promise<CardDetailBadge>
        }

        export interface ListAction {
            text: string

            callback(t: PowerUp.IFrame): PromiseLike<void>
        }

        export interface ListSorter {
            text: string

            callback(
                t: PowerUp.IFrame,
                options: {
                    cards: Card[]
                }
            ): PromiseLike<{ sortedIds: string[] }>
        }

        export interface CardButton {
            icon: string
            text: string
            condition?: Condition

            callback(t: Trello.PowerUp.IFrame): PromiseLike<void>

            url?: string
            target?: string
        }

        export interface AttachmentsByType {
            [key: string]: {
                board: number
                card: number
            }
        }

        export interface Preview {
            bytes: number
            height: number
            scaled: boolean
            url: string
            width: number
        }

        export interface AttachmentSectionBase {
            claimed: Attachment[]
            icon: string
            content: {
                type: string
                url: string
                height?: number
            }
        }

        export interface AttachmentSection extends AttachmentSectionBase {
            title: string
        }

        export interface LazyAttachmentSection extends AttachmentSectionBase {
            id: string

            title(): string
        }

        export interface Attachment {
            date: string
            edgeColor: string
            id: string
            idMember: string
            name: string
            previews: Preview[]
            url: string
        }

        export interface BadgesInfo {
            attachments: number
            attachmentsByType: AttachmentsByType
            checkItems: number
            checkItemsChecked: number
            comments: number
            description: boolean
            due: string // timestamp
            dueComplete: boolean
            fogbugz: string
            location: boolean
            subscribed: boolean
            viewingMemberVoted: boolean
            votes: number
        }

        export interface Coordinates {
            latitude: number
            longitude: number
        }

        export interface Label {
            id: string
            name: string
            color: Colors
        }

        export interface CustomField {
            id: string
            display: {
                cardFront: boolean
            }
            fieldGroup: string
            name: string
            pos: number
            type: string
        }

        export interface CustomFieldItem {
            id: string
            idCustomField: string
            idValue?: string
            value?: CustomFieldValue
        }

        export interface CustomFieldValue {
            checked?: string
            date?: string
            text?: string
            number?: string
        }

        export type MemberType = "admin" | "normal" | "observer"

        export interface Membership {
            deactivated: boolean
            id: string
            idMember: string
            memberType: MemberType
            unconfirmed: boolean
        }

        export interface Organization {
            id: string
            name: string
        }

        export interface Board {
            id: string
            name: string
            url: string // https://trello.com/c/I5nAdteE/9-test
            shortLink: string
            members: Member[]
            dateLastActivity: string // '2019-11-28T15:53:19.709Z'
            idOrganization: string
            customFields: CustomField[]
            labels: Label[]
            memberships: Membership[]
        }

        export interface Card {
            address: string | null
            attachments: Attachment[]
            badges: BadgesInfo
            closed: boolean
            coordinates: Coordinates | null
            cover: Attachment | null
            customFieldItems: CustomFieldItem[]
            dateLastActivity: string // '2019-11-28T15:53:19.709Z'
            desc: string
            due: string | null // '2019-11-28T15:53:19.709Z'
            dueComplete: boolean
            id: string
            idList: string
            idShort: number
            labels: Label[]
            locationName: string | null
            members: Member[]
            name: string
            pos: number
            shortLink: string
            url: string // https://trello.com/c/I5nAdteE/9-test
        }

        export interface List {
            id: string
            name: string
            cards: Card[]
        }

        export interface Member {
            id: string
            fullName: string | null
            username: string | null
            initials: string | null
            avatar: string | null
        }

        export interface Context {
            board: string
            card?: string
            command?: string
            member: string
            organization?: string
            enterprise?: string
            permissions?: {
                board: Permissions
                card: Permissions
                organization: Permissions
            }
            version: string
        }
    }
}
