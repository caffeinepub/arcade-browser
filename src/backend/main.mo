import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type LeaderboardEntry = {
    principal : Principal;
    gameId : Text;
    score : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let leaderboardEntries = Map.empty<Principal, Map.Map<Text, Nat>>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Leaderboard functions
  public shared ({ caller }) func submitScore(gameId : Text, score : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit scores");
    };
    let currentUserScores = switch (leaderboardEntries.get(caller)) {
      case (null) {
        let newScoreMap = Map.empty<Text, Nat>();
        newScoreMap.add(gameId, score);
        leaderboardEntries.add(caller, newScoreMap);
        newScoreMap;
      };
      case (?scores) {
        scores.add(gameId, score);
        scores;
      };
    };
  };

  public query ({ caller }) func getUserScores(user : Principal) : async [(Text, Nat)] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own scores");
    };
    switch (leaderboardEntries.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?scores) { scores.toArray() };
    };
  };
};
