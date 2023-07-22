import { DataPacket } from './DataPacket';
import { ChatRestrictionLevel } from './types/ChatRestrictionLevel';
import { PlayerMovementSettings } from './types/PlayerMovementSettings';
import { VersionInfo } from '../../PowerAllay';

export class StartGamePacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public entityUniqueId: number;
    public entityRuntimeId: number;
    public playerGamemode: number;
    public playerPosition: any;
    public rotation: any;
    public seed: number;
    public biomeType: number;
    public biomeName: string;
    public dimension: number;
    public generator: number;
    public worldGamemode: number;
    public difficulty: number;
    public spawnPosition: any;
    public AchievementsDisabled: boolean;
    public gameRules: any[];
    public itemStates: any[];
    public experiments: any[];
    public experimentsPreviouslyUsed: boolean;
    public permissionLevel: number;
    public worldName: string;
    public playerMovementSettings: PlayerMovementSettings;

    constructor() {
        super('start_game');
    }

    decode(): void {}

    encode(): object {
        return {
            entity_id: this.entityUniqueId,
            runtime_entity_id: this.entityRuntimeId,
            player_gamemode: this.playerGamemode,
            player_position: this.playerPosition,
            rotation: this.rotation,
            seed: this.seed,
            biome_type: this.biomeType,
            biome_name: this.biomeName,
            dimension: this.dimension,
            generator: this.generator,
            world_gamemode: this.worldGamemode,
            difficulty: this.difficulty,
            spawn_position: this.spawnPosition,
            achievements_disabled: this.AchievementsDisabled,
            editor_world: false,
            created_in_editor: false,
            exported_from_editor: false,
            day_cycle_stop_time: 0,
            edu_offer: 0,
            edu_features_enabled: false,
            edu_product_uuid: '',
            rain_level: 0,
            lightning_level: 0,
            has_confirmed_platform_locked_content: false,
            is_multiplayer: true,
            broadcast_to_lan: false,
            xbox_live_broadcast_mode: 4,
            platform_broadcast_mode: 4,
            enable_commands: true,
            is_texturepacks_required: false,
            gamerules: this.gameRules,
            experiments: this.experiments,
            experiments_previously_used: this.experimentsPreviouslyUsed,
            bonus_chest: false,
            map_enabled: false,
            permission_level: this.permissionLevel,
            server_chunk_tick_range: 4,
            has_locked_behavior_pack: false,
            has_locked_resource_pack: false,
            is_from_locked_world_template: false,
            msa_gamertags_only: false,
            is_from_world_template: false,
            is_world_template_option_locked: false,
            only_spawn_v1_villagers: false,
            persona_disable: false,
            custom_skins_disabled: false,
            emote_chat_muted: false,
            game_version: '*',
            limited_world_width: 0,
            limited_world_length: 0,
            is_new_nether: false,
            edu_resource_uri: {
                button_name: '',
                link_uri: ''
            },
            experimental_gameplay_override: false,
            chat_restriction_level: ChatRestrictionLevel.NONE,
            disable_player_interactions: false,
            level_id: this.worldName,
            world_name: this.worldName,
            premium_world_template_id: '00000000-0000-0000-0000-000000000000',
            is_trial: false,
            movement_authority: this.playerMovementSettings.getMovementAuthority(),
            rewind_history_size: this.playerMovementSettings.getRewindHistorySize(),
            server_authoritative_block_breaking: this.playerMovementSettings.isServerAuthoritativeBlockBreaking(),
            current_tick: [0, 0],
            enchantment_seed: 0,
            block_properties: [],
            itemstates: this.itemStates,
            multiplayer_correlation_id: '',
            server_authoritative_inventory: false,
            engine: VersionInfo.name,
            property_data: {
                type: 'compound',
                name: '',
                value: {}
            },
            block_pallette_checksum: [0, 0],
            world_template_id: '00000000-0000-0000-0000-000000000000',
            client_side_generation: false,
            block_network_ids_are_hashes: true,
            server_controlled_sound: false
        };
    }
}
