export type Role = 'Estimator' | 'Observer';

export type EstimationPhase =
  | 'Idle'
  | 'StoryDoctorReview'
  | 'Voting'
  | 'Revealed'
  | 'Discussing'
  | 'Slicing'
  | 'Finalized';

export interface Story {
  id: string;
  title: string;
  description: string;
  acceptance_criteria: string[];
}

export interface Participant {
  id: string;
  nickname: string;
  avatar: string;
  role: Role;
  connected: boolean;
  voted: boolean;
  vote?: string;
}

export type ConsensusCategory =
  | 'Consensus'
  | 'HighOutlier'
  | 'LowOutlier'
  | 'BimodalSplit'
  | 'WideSpread';

export interface ConsensusSummary {
  category: ConsensusCategory;
  consensus_pct: number;
  agreement_count: number;
  total_votes: number;
  suggested_points?: string;
  min_vote?: string;
  max_vote?: string;
}

export interface RoomSnapshotData {
  slug: string;
  short_code: string;
  phase: EstimationPhase;
  round_number: number;
  active_story: Story | null;
  participants: Participant[];
  facilitator_id: string;
  consensus: ConsensusSummary | null;
}

export type ClientCommand =
  | {
      type: 'JoinRoom';
      payload: {
        participant_id: string;
        nickname: string;
        avatar: string;
        role?: Role;
      };
    }
  | { type: 'SelectStory'; payload: { story: Story | null } }
  | { type: 'StartVoting' }
  | { type: 'CastVote'; payload: { value: string } }
  | { type: 'RetractVote' }
  | { type: 'RevealCards' }
  | { type: 'TriggerReVote' }
  | { type: 'FinalizeStory'; payload: { points?: string } }
  | { type: 'UpdateRole'; payload: { target_id: string; new_role: Role } }
  | { type: 'TransferFacilitator'; payload: { target_id: string } }
  | { type: 'Ping' };

export type ServerEvent =
  | { type: 'RoomSnapshot'; payload: { state: RoomSnapshotData } }
  | {
      type: 'ParticipantJoined';
      payload: {
        participant_id: string;
        nickname: string;
        avatar: string;
        role: Role;
      };
    }
  | { type: 'ParticipantLeft'; payload: { participant_id: string } }
  | { type: 'VoteCast'; payload: { participant_id: string } }
  | { type: 'VoteRetracted'; payload: { participant_id: string } }
  | {
      type: 'CardsRevealed';
      payload: {
        votes: Record<string, string>;
        distribution: ConsensusSummary | null;
      };
    }
  | { type: 'RoundReset'; payload: { round_number: number } }
  | { type: 'StoryFinalized'; payload: { story_id?: string; points: string } }
  | { type: 'RoleUpdated'; payload: { participant_id: string; role: Role } }
  | { type: 'FacilitatorChanged'; payload: { facilitator_id: string } }
  | { type: 'Error'; payload: { message: string } }
  | { type: 'Pong' };

export interface LocalSessionProfile {
  participant_id: string;
  nickname: string;
  avatar: string;
  role?: Role;
}
