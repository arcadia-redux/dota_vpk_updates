/// <reference path="../dota.d.ts" />
/// <reference path="../util.ts" />
/// <reference path="../sequence_actions.ts" />
/// <reference path="post_game_progress_utils.ts" />
/// <reference path="post_game_progress_screens.ts" />
class AnimateSpring2021LevelsAction extends RunSequentialActions {
    constructor(panel, eventId, bpPointsStart, bpPointsPerLevel, bpPointsAdd) {
        super();
        this.panel = panel;
        this.eventId = eventId;
        this.bpPointsStart = bpPointsStart;
        this.bpPointsPerLevel = bpPointsPerLevel;
        this.bpPointsAdd = bpPointsAdd;
        var battlePointsStart = this.bpPointsStart;
        var battleLevelStart = Math.floor(battlePointsStart / this.bpPointsPerLevel);
        var battlePointsAtLevelStart = battleLevelStart * this.bpPointsPerLevel;
        var bpLevelStart = battlePointsStart - battlePointsAtLevelStart;
        var bpLevelNext = this.bpPointsPerLevel;
        panel.SetDialogVariableInt('current_level_bp', bpLevelStart);
        panel.SetDialogVariableInt('bp_to_next_level', bpLevelNext);
        panel.FindChildInLayoutFile('BattlePassLevelShield').SetEventLevel(this.eventId, battleLevelStart);
        var progressBar = panel.FindChildInLayoutFile("BattleLevelProgress");
        progressBar.max = bpLevelNext;
        progressBar.lowervalue = bpLevelStart;
        progressBar.uppervalue = bpLevelStart;
        var bpEarned = 0;
        var bpLevel = bpLevelStart;
        var battleLevel = battleLevelStart;
        var bpRemaining = this.bpPointsAdd;
        var bpEarnedOnRow = 0;
        while (bpRemaining > 0) {
            var bpToAnimate = 0;
            var bpToNextLevel = 0;
            bpToNextLevel = bpLevelNext - bpLevel;
            bpToAnimate = Math.min(bpRemaining, bpToNextLevel);
            if (bpToAnimate > 0) {
                this.actions.push(new SkippableAction(new AnimateBattlePointsIncreaseAction(panel, bpToAnimate, bpEarnedOnRow, bpEarned, bpLevel)));
                bpEarned += bpToAnimate;
                bpLevel += bpToAnimate;
                bpEarnedOnRow += bpToAnimate;
                bpRemaining -= bpToAnimate;
            }
            bpToNextLevel = bpLevelNext - bpLevel;
            if (bpToNextLevel != 0)
                continue;
            battleLevel = battleLevel + 1;
            bpLevel = 0;
            this.actions.push(new AddClassAction(panel, 'LeveledUpStart'));
            (function (me, battleLevelInternal) {
                me.actions.push(new RunFunctionAction(function () {
                    var levelShield = panel.FindChildInLayoutFile('BattlePassLevelShield');
                    levelShield.AddClass('LeveledUp');
                    levelShield.SetEventLevel(me.eventId, battleLevelInternal);
                }));
            })(this, battleLevel);
            this.actions.push(new RemoveClassAction(panel, 'LeveledUpStart'));
            this.actions.push(new AddClassAction(panel, 'LeveledUpEnd'));
            this.actions.push(new SkippableAction(new WaitAction(1.0)));
            (function (me, battleLevelInternal) {
                me.actions.push(new RunFunctionAction(function () {
                    var levelShield = panel.FindChildInLayoutFile('BattlePassLevelShield');
                    levelShield.RemoveClass('LeveledUp');
                }));
            })(this, battleLevel);
            this.actions.push(new RemoveClassAction(panel, 'LeveledUpEnd'));
            (function (me, bpLevelInternal, bpLevelNextInternal) {
                me.actions.push(new RunFunctionAction(function () {
                    progressBar.lowervalue = 0;
                    progressBar.uppervalue = 0;
                    panel.SetDialogVariableInt('current_level_bp', bpLevelInternal);
                    panel.SetDialogVariableInt('bp_to_next_level', bpLevelNextInternal);
                    progressBar.max = bpLevelNextInternal;
                    // progressBar.value = bpLevelInternal;
                }));
            })(this, bpLevel, bpLevelNext);
        }
    }
}
//-----------------------------------------------------------------------------
// Animates spring 2021 subpanel
//-----------------------------------------------------------------------------
class AnimateSpring2021WeeklyProgressSubpanelAction extends RunSequentialActions {
    constructor(panel, ownerPanel, data, startingPoints) {
        super();
        this.data = data;
        this.panel = panel;
        this.ownerPanel = ownerPanel;
        this.startingPoints = startingPoints;
        this.total_points = 0;
        panel.AddClass('Visible');
    }
    start() {
        this.actions.push(new AddClassAction(this.panel, 'BecomeVisible'));
        this.actions.push(new SkippableAction(new WaitAction(g_DelayAfterStart)));
        this.actions.push(new AddClassAction(this.panel, 'ShowMap'));
        this.actions.push(new SkippableAction(new WaitAction(g_SubElementDelay)));
        this.actions.push(new AddClassAction(this.panel, 'ShowCompleted'));
        this.actions.push(new SkippableAction(new WaitAction(g_SubElementDelay)));
        var panel = this.panel;
        var weeklyProgressPanelParent = panel.FindChildInLayoutFile("Spring2021WeeklyProgressTypeDetails");
        for (var i = 0; i < this.data.length; ++i) {
            var data = this.data[i];
            AddNewWeeklyProgressPanelSpring2021(this, weeklyProgressPanelParent, i, data);
        }
        var panel = this.panel;
        var ownerPanel = this.ownerPanel;
        var total_points = this.total_points;
        var startingPoints = this.startingPoints;
        this.actions.push(new RunFunctionAction(function () {
            UpdateSubpanelTotalPoints(panel, ownerPanel, total_points, startingPoints, false);
        }));
        super.start();
    }
    ;
}
class AnimateSpring2021WeeklyProgressIncreaseAction extends RunParallelActions {
    constructor(panel, name, description, nStarsGranted, nProgressAmount, nStartAmount, nMaxAmount) {
        super();
        this.panel = panel;
        this.name = name;
        this.description = description;
        this.nStarsGranted = nStarsGranted;
        this.nProgressAmount = nProgressAmount;
        this.nStartAmount = nStartAmount;
        this.nMaxAmount = nMaxAmount;
    }
    start() {
        var duration = GetBPIncreaseAnimationDuration(this.nProgressAmount) * 3.0;
        var levelProgressBar = this.panel.FindChildInLayoutFile('ProgressBar');
        var minProgressValue = Math.min(this.nStartAmount, this.nMaxAmount);
        var maxProgressValue = Math.min(this.nStartAmount + this.nProgressAmount, this.nMaxAmount);
        var self = this;
        this.actions.push(new RunFunctionAction(function () {
            levelProgressBar.lowervalue = self.panel.nInitialAmount;
            levelProgressBar.uppervalue = maxProgressValue;
            levelProgressBar.max = self.nMaxAmount;
            $.Msg("setting progress bar values " + self.nStartAmount + " " + self.nProgressAmount + " " + levelProgressBar.max);
            self.panel.SetDialogVariableInt("progress_max_value", self.nMaxAmount);
            self.panel.SetDialogVariableLocString("progress_name", self.name);
            self.panel.SetDialogVariable("progress_description", self.description);
        }));
        this.actions.push(new AnimateDialogVariableIntAction(this.panel, 'progress_start_value', minProgressValue, maxProgressValue, duration));
        this.actions.push(new AnimateDialogVariableIntAction(this.panel, 'current_level_bp', minProgressValue, maxProgressValue, duration));
        this.actions.push(new AnimateProgressBarWithMiddleAction(levelProgressBar, minProgressValue, maxProgressValue, duration));
        this.actions.push(new PlaySoundForDurationAction("XP.Count", duration));
        super.start();
    }
    finish() {
        var maxProgressValue = Math.min(this.nStartAmount + this.nProgressAmount, this.nMaxAmount);
        var nStarsGranted = this.nStarsGranted;
        if (maxProgressValue == this.nMaxAmount) {
            ++nStarsGranted;
        }
        this.panel.SetHasClass("StarsGranted1", nStarsGranted > 0);
        this.panel.SetHasClass("StarsGranted2", nStarsGranted > 1);
        this.panel.SetHasClass("StarsGranted3", nStarsGranted > 2);
        if (nStarsGranted > this.panel.nStarsGranted) {
            this.panel.AddClass("StarsGrantedPulse" + nStarsGranted);
            $.DispatchEvent('PlaySoundEffect', "WeeklyQuest.StarGranted");
        }
        this.panel.nStarsGranted = nStarsGranted;
        super.finish();
    }
}
class AnimateSpring2021WeeklyProgressLevels extends RunSequentialActions {
    constructor(panel, nStartValue, nProgress, levelThresholds) {
        super();
        var nCurrentProgress = nStartValue;
        var nProgressRemaining = nProgress;
        var nNextThresholdIndex = 0;
        for (let i = 0; i < levelThresholds.length; ++i) {
            if (levelThresholds[i].threshold > nCurrentProgress) {
                nNextThresholdIndex = i;
                break;
            }
        }
        var bFirst = true;
        while (nProgressRemaining > 0) {
            var levelThreshold = levelThresholds[nNextThresholdIndex++];
            if (levelThreshold != undefined) {
                var nNextProgressThreshold = levelThreshold.threshold;
                var nProgressToNextLevel = nNextProgressThreshold - nCurrentProgress;
                var nProgressToAnimateThisThreshold = Math.min(nProgressRemaining, nProgressToNextLevel);
                if (nProgressToAnimateThisThreshold > 0) {
                    var nStarsGranted = Math.max(0, nNextThresholdIndex - 1);
                    if (bFirst) {
                        // initialize values before the animation plays so we don't get blank dialog variables
                        panel.SetDialogVariable("progress_description", levelThreshold.description);
                        panel.SetDialogVariableLocString("progress_name", levelThreshold.name);
                        panel.nStarsGranted = nStarsGranted;
                        panel.nInitialAmount = nStartValue;
                        panel.SetHasClass("StarsGranted1", nStarsGranted > 0);
                        panel.SetHasClass("StarsGranted2", nStarsGranted > 1);
                        panel.SetHasClass("StarsGranted3", nStarsGranted > 2);
                        bFirst = false;
                    }
                    // Build a set of sequences for levelling up to the threshold.
                    this.actions.push(new SkippableAction(new AnimateSpring2021WeeklyProgressIncreaseAction(panel, levelThreshold.name, levelThreshold.description, nStarsGranted, nProgressToAnimateThisThreshold, nCurrentProgress, nNextProgressThreshold)));
                    nCurrentProgress += nProgressToAnimateThisThreshold;
                    nProgressRemaining -= nProgressToAnimateThisThreshold;
                }
                nProgressToNextLevel = nNextProgressThreshold - nCurrentProgress;
                continue;
            }
            // Show the next tier if it exists:
            {
                if (nNextThresholdIndex < levelThresholds.length) {
                    var nNextProgressThreshold = levelThresholds[Math.min(nNextThresholdIndex, levelThresholds.length - 1)].threshold;
                    this.actions.push(new SkippableAction(new AnimateSpring2021WeeklyProgressIncreaseAction(panel, levelThresholds[nNextThresholdIndex].name, levelThresholds[nNextThresholdIndex].description, nNextThresholdIndex, 0, nCurrentProgress, nNextProgressThreshold)));
                }
            }
            break;
        }
    }
}
var AddNewWeeklyProgressPanelSpring2021 = function (seq, parentPanel, i, data) {
    var panel = $.CreatePanel('Panel', parentPanel, 'WeeklyProgress' + i);
    panel.BLoadLayoutSnippet('Spring2021WeeklyProgressEntry');
    panel.SetDialogVariableInt("progress_start_value", data.progress_start_value);
    panel.SetDialogVariableInt("progress_max_value", data.progress_start_value);
    panel.SetDialogVariable("progress", data.progress.toString());
    seq.actions.push(new AnimateSpring2021WeeklyProgressLevels(panel, data.progress_start_value, data.progress, data.level_thresholds));
};
// Spring2021 BP Progress
class AnimateSpring2021ScreenAction extends RunSequentialActions {
    constructor(data) {
        super();
        this.data = data;
    }
    start() {
        // Create the screen and do a bunch of initial setup
        var panel = StartNewScreen('Spring2021ProgressScreen');
        panel.BLoadLayoutSnippet("Spring2021Progress");
        panel.SetDialogVariableInt('points_available', this.data.spring_2021_progress.points_available);
        panel.SetDialogVariableInt('active_week', this.data.spring_2021_progress.active_season_id);
        panel.FindChildInLayoutFile('WeeklyQuestProgressPipBar').SetLocalUserSeasonInfo(this.data.spring_2021_progress.battle_points_event_id, this.data.spring_2021_progress.active_season_id);
        panel.SetDialogVariableInt('total_points_gained', 0);
        // Setup the sequence of actions to animate the screen
        this.actions.push(new AddClassAction(panel, 'ShowScreen'));
        this.actions.push(new SkippableAction(new WaitAction(0.5)));
        this.actions.push(new AddScreenLinkAction(panel, 'Spring2021Progress', '#DOTA_PlusPostGame_Spring2021Progress', function () {
            panel.SwitchClass('current_screen', 'ShowSpring2021Progress');
        }));
        this.actions.push(new SwitchClassAction(panel, 'current_screen', 'ShowSpring2021Progress'));
        this.actions.push(new SkippableAction(new WaitAction(0.5)));
        var subPanelActions = new RunSkippableStaggeredActions(.3);
        var startingPointsToAdd = 0;
        var panelCount = 0;
        var kMaxPanels = 6;
        if (this.data.spring_2021_progress.actions_granted != null) {
            var progressPanel = panel.FindChildInLayoutFile("Spring2021WeeklyProgress");
            const subpanelAction = new AnimateSpring2021WeeklyProgressSubpanelAction(progressPanel, panel, this.data.spring_2021_progress.actions_granted, startingPointsToAdd);
            startingPointsToAdd += subpanelAction.total_points;
            subPanelActions.actions.push(subpanelAction);
            if (++panelCount > kMaxPanels)
                progressPanel.RemoveClass('Visible');
        }
        if (this.data.spring_2021_progress.event_game_nemestice != null) {
            var progressPanel = panel.FindChildInLayoutFile("Spring2021EventGameNemesticeProgress");
            const subpanelAction = new AnimateEventGameNemesticeSubpanelAction(progressPanel, panel, this.data.spring_2021_progress.event_game_nemestice, startingPointsToAdd);
            startingPointsToAdd += subpanelAction.total_points;
            subPanelActions.actions.push(subpanelAction);
            if (++panelCount > kMaxPanels)
                progressPanel.RemoveClass('Visible');
        }
        if (this.data.spring_2021_progress.cavern_crawl != null) {
            var cavernPanel = panel.FindChildInLayoutFile("Spring2021CavernCrawlProgress");
            const subpanelAction = new AnimateCavernCrawlSubpanelAction(cavernPanel, panel, this.data.spring_2021_progress.cavern_crawl, startingPointsToAdd);
            startingPointsToAdd += subpanelAction.total_points;
            subPanelActions.actions.push(subpanelAction);
            if (++panelCount > kMaxPanels)
                cavernPanel.RemoveClass('Visible');
        }
        this.actions.push(subPanelActions);
        this.actions.push(new AnimateSpring2021LevelsAction(panel, this.data.spring_2021_progress.battle_points_event_id, this.data.spring_2021_progress.battle_points_start, this.data.spring_2021_progress.battle_points_per_level, startingPointsToAdd));
        this.actions.push(new WaitAction(0.2));
        this.actions.push(new StopSkippingAheadAction());
        this.actions.push(new SkippableAction(new WaitAction(0.5)));
        this.actions.push(new SwitchClassAction(panel, 'current_screen', ''));
        this.actions.push(new SkippableAction(new WaitAction(0.5)));
        super.start();
    }
}
//----------------------------------
function TestAnimateSpring2021() {
    var data = {
        hero_id: 87,
        spring_2021_progress: {
            active_season_id: 1,
            battle_points_event_id: 32,
            battle_points_start: 74850,
            battle_points_per_level: 1000,
            points_available: 1000,
            actions_granted: [
                {
                    // Cross a tier
                    progress_start_value: 1,
                    progress: 40,
                    level_thresholds: [
                        {
                            name: "#DOTA_Spring2021_Quest_Plays_Name",
                            description: 'Win <span class="ScoreTierCurrent">3</span> Matches',
                            threshold: 3
                        },
                        {
                            name: "#DOTA_Spring2021_Quest_Plays_Name",
                            description: 'Win <span class="ScoreTierCurrent">10</span> Matches',
                            threshold: 10
                        },
                        {
                            name: "#DOTA_Spring2021_Quest_Plays_Name",
                            description: 'Win <span class="ScoreTierCurrent">30</span> Matches',
                            threshold: 30
                        },
                    ]
                },
                {
                    // Cross past max tier
                    progress_start_value: 141,
                    progress: 10,
                    level_thresholds: [
                        {
                            name: "#DOTA_Spring2021_Quest_Wins_Name",
                            description: 'Win <span class="ScoreTierCurrent">10</span> Matches',
                            threshold: 10
                        },
                        {
                            name: "#DOTA_Spring2021_Quest_Wins_Name",
                            description: 'Win <span class="ScoreTierCurrent">50</span> Matches',
                            threshold: 50
                        },
                        {
                            name: "#DOTA_Spring2021_Quest_Wins_Name",
                            description: 'Win <span class="ScoreTierCurrent">150</span> Matches',
                            threshold: 150
                        },
                    ]
                },
                {
                    // Minor increment
                    progress_start_value: 0,
                    progress: 0.5,
                    level_thresholds: [
                        {
                            name: "#DOTA_Spring2021_Quest_Kills_Name",
                            description: 'Win <span class="ScoreTierCurrent">10</span> Matches',
                            threshold: 10
                        },
                        {
                            name: "#DOTA_Spring2021_Quest_Kills_Name",
                            description: 'Win <span class="ScoreTierCurrent">50</span> Matches',
                            threshold: 50
                        },
                        {
                            name: "#DOTA_Spring2021_Quest_Kills_Name",
                            description: 'Win <span class="ScoreTierCurrent">150</span> Matches',
                            threshold: 150
                        },
                    ]
                },
            ],
            cavern_crawl: {
                hero_id: 87,
                bp_amount: 375,
            },
            event_game_nemestice: {
                bp_amount: 225,
                bp_start: 50,
                bp_max: 2000,
            }
        }
    };
    TestProgressAnimation(data);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdF9nYW1lX3Byb2dyZXNzX3NwcmluZzIwMjEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb3N0X2dhbWVfcHJvZ3Jlc3Nfc3ByaW5nMjAyMS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFDckMsbUNBQW1DO0FBQ25DLCtDQUErQztBQUMvQyxvREFBb0Q7QUFDcEQsc0RBQXNEO0FBaUR0RCxNQUFNLDZCQUE4QixTQUFRLG9CQUFvQjtJQVE1RCxZQUFhLEtBQWMsRUFBRSxPQUFlLEVBQUUsYUFBcUIsRUFBRSxnQkFBd0IsRUFBRSxXQUFtQjtRQUU5RyxLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUUvQixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDM0MsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLGlCQUFpQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBRSxDQUFDO1FBQy9FLElBQUksd0JBQXdCLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQ3hFLElBQUksWUFBWSxHQUFHLGlCQUFpQixHQUFHLHdCQUF3QixDQUFDO1FBQ2hFLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUV4QyxLQUFLLENBQUMsb0JBQW9CLENBQUUsa0JBQWtCLEVBQUUsWUFBWSxDQUFFLENBQUM7UUFDL0QsS0FBSyxDQUFDLG9CQUFvQixDQUFFLGtCQUFrQixFQUFFLFdBQVcsQ0FBRSxDQUFDO1FBQzVELEtBQUssQ0FBQyxxQkFBcUIsQ0FBRSx1QkFBdUIsQ0FBOEIsQ0FBQyxhQUFhLENBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBRSxDQUFDO1FBRXJJLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBRSxxQkFBcUIsQ0FBNkIsQ0FBQztRQUNsRyxXQUFXLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQztRQUM5QixXQUFXLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQztRQUN0QyxXQUFXLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQztRQUV0QyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDO1FBQzNCLElBQUksV0FBVyxHQUFHLGdCQUFnQixDQUFDO1FBRW5DLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbkMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBRXRCLE9BQVEsV0FBVyxHQUFHLENBQUMsRUFDdkI7WUFDSSxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLGFBQWEsR0FBRyxXQUFXLEdBQUcsT0FBTyxDQUFDO1lBQ3RDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLFdBQVcsRUFBRSxhQUFhLENBQUUsQ0FBQztZQUVyRCxJQUFLLFdBQVcsR0FBRyxDQUFDLEVBQ3BCO2dCQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUNiLElBQUksZUFBZSxDQUNmLElBQUksaUNBQWlDLENBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBRSxDQUNoRyxDQUNKLENBQUM7Z0JBRUYsUUFBUSxJQUFJLFdBQVcsQ0FBQztnQkFDeEIsT0FBTyxJQUFJLFdBQVcsQ0FBQztnQkFDdkIsYUFBYSxJQUFJLFdBQVcsQ0FBQztnQkFDN0IsV0FBVyxJQUFJLFdBQVcsQ0FBQzthQUM5QjtZQUVELGFBQWEsR0FBRyxXQUFXLEdBQUcsT0FBTyxDQUFDO1lBRXRDLElBQUssYUFBYSxJQUFJLENBQUM7Z0JBQ25CLFNBQVM7WUFFYixXQUFXLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUM5QixPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBRVosSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxjQUFjLENBQUUsS0FBSyxFQUFFLGdCQUFnQixDQUFFLENBQUUsQ0FBQztZQUVuRSxDQUFFLFVBQVcsRUFBRSxFQUFFLG1CQUFtQjtnQkFFaEMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxpQkFBaUIsQ0FBRTtvQkFFcEMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFFLHVCQUF1QixDQUE0QixDQUFDO29CQUNuRyxXQUFXLENBQUMsUUFBUSxDQUFFLFdBQVcsQ0FBRSxDQUFDO29CQUNwQyxXQUFXLENBQUMsYUFBYSxDQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUUsQ0FBQztnQkFDakUsQ0FBQyxDQUFFLENBQUUsQ0FBQztZQUNWLENBQUMsQ0FBRSxDQUFFLElBQUksRUFBRSxXQUFXLENBQUUsQ0FBQztZQUV6QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLGlCQUFpQixDQUFFLEtBQUssRUFBRSxnQkFBZ0IsQ0FBRSxDQUFFLENBQUM7WUFDdEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxjQUFjLENBQUUsS0FBSyxFQUFFLGNBQWMsQ0FBRSxDQUFFLENBQUM7WUFDakUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxlQUFlLENBQUUsSUFBSSxVQUFVLENBQUUsR0FBRyxDQUFFLENBQUUsQ0FBRSxDQUFDO1lBRWxFLENBQUUsVUFBVyxFQUFFLEVBQUUsbUJBQW1CO2dCQUVoQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLGlCQUFpQixDQUFFO29CQUVwQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMscUJBQXFCLENBQUUsdUJBQXVCLENBQTRCLENBQUM7b0JBQ25HLFdBQVcsQ0FBQyxXQUFXLENBQUUsV0FBVyxDQUFFLENBQUM7Z0JBQzNDLENBQUMsQ0FBRSxDQUFFLENBQUM7WUFDVixDQUFDLENBQUUsQ0FBRSxJQUFJLEVBQUUsV0FBVyxDQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxpQkFBaUIsQ0FBRSxLQUFLLEVBQUUsY0FBYyxDQUFFLENBQUUsQ0FBQztZQUVwRSxDQUFFLFVBQVcsRUFBRSxFQUFFLGVBQWUsRUFBRSxtQkFBbUI7Z0JBRWpELEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksaUJBQWlCLENBQUU7b0JBRXBDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO29CQUMzQixXQUFXLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztvQkFDM0IsS0FBSyxDQUFDLG9CQUFvQixDQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBRSxDQUFDO29CQUNsRSxLQUFLLENBQUMsb0JBQW9CLENBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLENBQUUsQ0FBQztvQkFDdEUsV0FBVyxDQUFDLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQztvQkFDdEMsdUNBQXVDO2dCQUMzQyxDQUFDLENBQUUsQ0FBRSxDQUFDO1lBQ1YsQ0FBQyxDQUFFLENBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUUsQ0FBQztTQUNyQztJQUNMLENBQUM7Q0FDSjtBQUVELCtFQUErRTtBQUMvRSxnQ0FBZ0M7QUFDaEMsK0VBQStFO0FBQy9FLE1BQU0sNkNBQThDLFNBQVEsb0JBQW9CO0lBUTVFLFlBQWEsS0FBYyxFQUFFLFVBQW1CLEVBQUUsSUFBK0MsRUFBRSxjQUFzQjtRQUVySCxLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBRXRCLEtBQUssQ0FBQyxRQUFRLENBQUUsU0FBUyxDQUFFLENBQUM7SUFDaEMsQ0FBQztJQUdELEtBQUs7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLGNBQWMsQ0FBRSxJQUFJLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBRSxDQUFFLENBQUM7UUFDdkUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxlQUFlLENBQUUsSUFBSSxVQUFVLENBQUUsaUJBQWlCLENBQUUsQ0FBRSxDQUFFLENBQUM7UUFFaEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxjQUFjLENBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUUsQ0FBRSxDQUFDO1FBQ2pFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksZUFBZSxDQUFFLElBQUksVUFBVSxDQUFFLGlCQUFpQixDQUFFLENBQUUsQ0FBRSxDQUFDO1FBRWhGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksY0FBYyxDQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFFLENBQUUsQ0FBQztRQUN2RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLGVBQWUsQ0FBRSxJQUFJLFVBQVUsQ0FBRSxpQkFBaUIsQ0FBRSxDQUFFLENBQUUsQ0FBQztRQUVoRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRXZCLElBQUkseUJBQXlCLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFFLHFDQUFxQyxDQUFFLENBQUM7UUFFckcsS0FBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUMxQztZQUNJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsbUNBQW1DLENBQUUsSUFBSSxFQUFFLHlCQUF5QixFQUFFLENBQUMsRUFBRSxJQUFJLENBQUUsQ0FBQztTQUNuRjtRQUVELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdkIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNqQyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3JDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxpQkFBaUIsQ0FBRTtZQUV0Qyx5QkFBeUIsQ0FBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFFLENBQUM7UUFDeEYsQ0FBQyxDQUFFLENBQUUsQ0FBQztRQUVOLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBQUEsQ0FBQztDQUNMO0FBUUQsTUFBTSw2Q0FBOEMsU0FBUSxrQkFBa0I7SUFVMUUsWUFBYSxLQUE0QixFQUFFLElBQVksRUFBRSxXQUFtQixFQUFFLGFBQXFCLEVBQUUsZUFBdUIsRUFBRSxZQUFvQixFQUFFLFVBQWtCO1FBRWxLLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDakMsQ0FBQztJQUVELEtBQUs7UUFFRCxJQUFJLFFBQVEsR0FBRyw4QkFBOEIsQ0FBRSxJQUFJLENBQUMsZUFBZSxDQUFFLEdBQUcsR0FBRyxDQUFDO1FBQzVFLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBRSxhQUFhLENBQTZCLENBQUM7UUFFcEcsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDO1FBQ3RFLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDO1FBRTdGLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLGlCQUFpQixDQUFFO1lBRXRDLGdCQUFnQixDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUN4RCxnQkFBZ0IsQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7WUFDL0MsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDdkMsQ0FBQyxDQUFDLEdBQUcsQ0FBRSw4QkFBOEIsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUUsQ0FBQztZQUN0SCxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFFLG9CQUFvQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FBQztZQUN6RSxJQUFJLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUM7WUFDcEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBRSxzQkFBc0IsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFFLENBQUM7UUFFN0UsQ0FBQyxDQUFFLENBQUUsQ0FBQztRQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksOEJBQThCLENBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLENBQUUsQ0FBRSxDQUFDO1FBQzVJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksOEJBQThCLENBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLENBQUUsQ0FBRSxDQUFDO1FBQ3hJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksa0NBQWtDLENBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxDQUFFLENBQUUsQ0FBQztRQUM5SCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLDBCQUEwQixDQUFFLFVBQVUsRUFBRSxRQUFRLENBQUUsQ0FBRSxDQUFDO1FBRTVFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQsTUFBTTtRQUVGLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDO1FBRTdGLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDdkMsSUFBSyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUN4QztZQUNJLEVBQUUsYUFBYSxDQUFDO1NBQ25CO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUUsZUFBZSxFQUFFLGFBQWEsR0FBRyxDQUFDLENBQUUsQ0FBQztRQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBRSxlQUFlLEVBQUUsYUFBYSxHQUFHLENBQUMsQ0FBRSxDQUFDO1FBQzdELElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFFLGVBQWUsRUFBRSxhQUFhLEdBQUcsQ0FBQyxDQUFFLENBQUM7UUFFN0QsSUFBSyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQzdDO1lBQ0ksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUUsbUJBQW1CLEdBQUcsYUFBYSxDQUFFLENBQUM7WUFDM0QsQ0FBQyxDQUFDLGFBQWEsQ0FBRSxpQkFBaUIsRUFBRSx5QkFBeUIsQ0FBRSxDQUFDO1NBQ25FO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBRXpDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNuQixDQUFDO0NBQ0o7QUFFRCxNQUFNLHFDQUFzQyxTQUFRLG9CQUFvQjtJQUVwRSxZQUFhLEtBQTRCLEVBQUUsV0FBbUIsRUFBRSxTQUFpQixFQUFFLGVBQTJEO1FBRTFJLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxnQkFBZ0IsR0FBRyxXQUFXLENBQUM7UUFDbkMsSUFBSSxrQkFBa0IsR0FBRyxTQUFTLENBQUM7UUFFbkMsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLENBQUM7UUFFNUIsS0FBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQ2hEO1lBQ0ksSUFBSyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLGdCQUFnQixFQUNwRDtnQkFDSSxtQkFBbUIsR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU07YUFDVDtTQUNKO1FBRUQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBRWxCLE9BQVEsa0JBQWtCLEdBQUcsQ0FBQyxFQUM5QjtZQUNJLElBQUksY0FBYyxHQUFHLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7WUFFNUQsSUFBSyxjQUFjLElBQUksU0FBUyxFQUNoQztnQkFDSSxJQUFJLHNCQUFzQixHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7Z0JBQ3RELElBQUksb0JBQW9CLEdBQUcsc0JBQXNCLEdBQUcsZ0JBQWdCLENBQUM7Z0JBRXJFLElBQUksK0JBQStCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBRSxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBRSxDQUFDO2dCQUUzRixJQUFLLCtCQUErQixHQUFHLENBQUMsRUFDeEM7b0JBQ0ksSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFDLEVBQUUsbUJBQW1CLEdBQUcsQ0FBQyxDQUFFLENBQUM7b0JBQzNELElBQUssTUFBTSxFQUNYO3dCQUNJLHNGQUFzRjt3QkFDdEYsS0FBSyxDQUFDLGlCQUFpQixDQUFFLHNCQUFzQixFQUFFLGNBQWMsQ0FBQyxXQUFXLENBQUUsQ0FBQzt3QkFDOUUsS0FBSyxDQUFDLDBCQUEwQixDQUFFLGVBQWUsRUFBRSxjQUFjLENBQUMsSUFBSSxDQUFFLENBQUM7d0JBRXpFLEtBQUssQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO3dCQUNwQyxLQUFLLENBQUMsY0FBYyxHQUFHLFdBQVcsQ0FBQzt3QkFFbkMsS0FBSyxDQUFDLFdBQVcsQ0FBRSxlQUFlLEVBQUUsYUFBYSxHQUFHLENBQUMsQ0FBRSxDQUFDO3dCQUN4RCxLQUFLLENBQUMsV0FBVyxDQUFFLGVBQWUsRUFBRSxhQUFhLEdBQUcsQ0FBQyxDQUFFLENBQUM7d0JBQ3hELEtBQUssQ0FBQyxXQUFXLENBQUUsZUFBZSxFQUFFLGFBQWEsR0FBRyxDQUFDLENBQUUsQ0FBQzt3QkFDeEQsTUFBTSxHQUFHLEtBQUssQ0FBQztxQkFDbEI7b0JBRUQsOERBQThEO29CQUM5RCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDYixJQUFJLGVBQWUsQ0FDZixJQUFJLDZDQUE2QyxDQUM3QyxLQUFLLEVBQ0wsY0FBYyxDQUFDLElBQUksRUFDbkIsY0FBYyxDQUFDLFdBQVcsRUFDMUIsYUFBYSxFQUNiLCtCQUErQixFQUMvQixnQkFBZ0IsRUFDaEIsc0JBQXNCLENBQ3pCLENBQ0osQ0FDSixDQUFDO29CQUVGLGdCQUFnQixJQUFJLCtCQUErQixDQUFDO29CQUNwRCxrQkFBa0IsSUFBSSwrQkFBK0IsQ0FBQztpQkFDekQ7Z0JBRUQsb0JBQW9CLEdBQUcsc0JBQXNCLEdBQUcsZ0JBQWdCLENBQUM7Z0JBRWpFLFNBQVM7YUFDWjtZQUVELG1DQUFtQztZQUNuQztnQkFDSSxJQUFLLG1CQUFtQixHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQ2pEO29CQUNJLElBQUksc0JBQXNCLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztvQkFDcEgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2IsSUFBSSxlQUFlLENBQ2YsSUFBSSw2Q0FBNkMsQ0FDN0MsS0FBSyxFQUNMLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksRUFDekMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxFQUNoRCxtQkFBbUIsRUFDbkIsQ0FBQyxFQUNELGdCQUFnQixFQUNoQixzQkFBc0IsQ0FDekIsQ0FDSixDQUNKLENBQUM7aUJBQ0w7YUFDSjtZQUNELE1BQU07U0FDVDtJQUNMLENBQUM7Q0FDSjtBQUVELElBQUksbUNBQW1DLEdBQUcsVUFBVyxHQUF5QixFQUFFLFdBQW9CLEVBQUUsQ0FBUyxFQUFFLElBQTZDO0lBRTFKLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsR0FBRyxDQUFDLENBQUUsQ0FBQztJQUN4RSxLQUFLLENBQUMsa0JBQWtCLENBQUUsK0JBQStCLENBQUUsQ0FBQztJQUM1RCxLQUFLLENBQUMsb0JBQW9CLENBQUUsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFFLENBQUM7SUFDaEYsS0FBSyxDQUFDLG9CQUFvQixDQUFFLG9CQUFvQixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBRSxDQUFDO0lBQzlFLEtBQUssQ0FBQyxpQkFBaUIsQ0FBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBRSxDQUFDO0lBRWhFLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUkscUNBQXFDLENBQUUsS0FBOEIsRUFDdkYsSUFBSSxDQUFDLG9CQUFvQixFQUN6QixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxnQkFBZ0IsQ0FDeEIsQ0FDQSxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBR0YseUJBQXlCO0FBQ3pCLE1BQU0sNkJBQThCLFNBQVEsb0JBQW9CO0lBSTVELFlBQWEsSUFBNEI7UUFFckMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQsS0FBSztRQUVELG9EQUFvRDtRQUNwRCxJQUFJLEtBQUssR0FBRyxjQUFjLENBQUUsMEJBQTBCLENBQUUsQ0FBQztRQUN6RCxLQUFLLENBQUMsa0JBQWtCLENBQUUsb0JBQW9CLENBQUUsQ0FBQztRQUVqRCxLQUFLLENBQUMsb0JBQW9CLENBQUUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBRSxDQUFDO1FBQ2xHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBRSxDQUFDO1FBRTNGLEtBQUssQ0FBQyxxQkFBcUIsQ0FBRSwyQkFBMkIsQ0FBK0IsQ0FBQyxzQkFBc0IsQ0FDNUcsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsRUFDckQsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBRSxDQUFDO1FBRXRELEtBQUssQ0FBQyxvQkFBb0IsQ0FBRSxxQkFBcUIsRUFBRSxDQUFDLENBQUUsQ0FBQztRQUV2RCxzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxjQUFjLENBQUUsS0FBSyxFQUFFLFlBQVksQ0FBRSxDQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxlQUFlLENBQUUsSUFBSSxVQUFVLENBQUUsR0FBRyxDQUFFLENBQUUsQ0FBRSxDQUFDO1FBRWxFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksbUJBQW1CLENBQUUsS0FBSyxFQUFFLG9CQUFvQixFQUFFLHVDQUF1QyxFQUFFO1lBRTlHLEtBQUssQ0FBQyxXQUFXLENBQUUsZ0JBQWdCLEVBQUUsd0JBQXdCLENBQUUsQ0FBQztRQUNwRSxDQUFDLENBQUUsQ0FBRSxDQUFDO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxpQkFBaUIsQ0FBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsd0JBQXdCLENBQUUsQ0FBRSxDQUFDO1FBQ2hHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksZUFBZSxDQUFFLElBQUksVUFBVSxDQUFFLEdBQUcsQ0FBRSxDQUFFLENBQUUsQ0FBQztRQUVsRSxJQUFJLGVBQWUsR0FBRyxJQUFJLDRCQUE0QixDQUFFLEVBQUUsQ0FBRSxDQUFDO1FBRTdELElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFbkIsSUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsSUFBSSxJQUFJLEVBQzNEO1lBQ0ksSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFFLDBCQUEwQixDQUFFLENBQUM7WUFDOUUsTUFBTSxjQUFjLEdBQUcsSUFBSSw2Q0FBNkMsQ0FDcEUsYUFBYSxFQUNiLEtBQUssRUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsRUFDOUMsbUJBQW1CLENBQ3RCLENBQUM7WUFDRixtQkFBbUIsSUFBSSxjQUFjLENBQUMsWUFBWSxDQUFDO1lBQ25ELGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLGNBQWMsQ0FBRSxDQUFDO1lBQy9DLElBQUssRUFBRSxVQUFVLEdBQUcsVUFBVTtnQkFDMUIsYUFBYSxDQUFDLFdBQVcsQ0FBRSxTQUFTLENBQUUsQ0FBQztTQUM5QztRQUVELElBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLEVBQ2hFO1lBQ0ksSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFFLHNDQUFzQyxDQUFFLENBQUM7WUFDMUYsTUFBTSxjQUFjLEdBQUcsSUFBSSx1Q0FBdUMsQ0FDOUQsYUFBYSxFQUNiLEtBQUssRUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixFQUNuRCxtQkFBbUIsQ0FBRSxDQUFDO1lBQzFCLG1CQUFtQixJQUFJLGNBQWMsQ0FBQyxZQUFZLENBQUM7WUFDbkQsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsY0FBYyxDQUFFLENBQUM7WUFDL0MsSUFBSyxFQUFFLFVBQVUsR0FBRyxVQUFVO2dCQUMxQixhQUFhLENBQUMsV0FBVyxDQUFFLFNBQVMsQ0FBRSxDQUFDO1NBQzlDO1FBRUQsSUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksSUFBSSxJQUFJLEVBQ3hEO1lBQ0ksSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFFLCtCQUErQixDQUFFLENBQUM7WUFDakYsTUFBTSxjQUFjLEdBQUcsSUFBSSxnQ0FBZ0MsQ0FBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxFQUFFLG1CQUFtQixDQUFFLENBQUM7WUFDcEosbUJBQW1CLElBQUksY0FBYyxDQUFDLFlBQVksQ0FBQztZQUNuRCxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxjQUFjLENBQUUsQ0FBQztZQUMvQyxJQUFLLEVBQUUsVUFBVSxHQUFHLFVBQVU7Z0JBQzFCLFdBQVcsQ0FBQyxXQUFXLENBQUUsU0FBUyxDQUFFLENBQUM7U0FDNUM7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxlQUFlLENBQUUsQ0FBQztRQUVyQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLDZCQUE2QixDQUFFLEtBQUssRUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsRUFDckQsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsRUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyx1QkFBdUIsRUFDdEQsbUJBQW1CLENBQUUsQ0FBRSxDQUFDO1FBRTVCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksVUFBVSxDQUFFLEdBQUcsQ0FBRSxDQUFFLENBQUM7UUFFM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSx1QkFBdUIsRUFBRSxDQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxlQUFlLENBQUUsSUFBSSxVQUFVLENBQUUsR0FBRyxDQUFFLENBQUUsQ0FBRSxDQUFDO1FBQ2xFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksaUJBQWlCLENBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsQ0FBRSxDQUFFLENBQUM7UUFDMUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxlQUFlLENBQUUsSUFBSSxVQUFVLENBQUUsR0FBRyxDQUFFLENBQUUsQ0FBRSxDQUFDO1FBRWxFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNsQixDQUFDO0NBQ0o7QUFFRCxvQ0FBb0M7QUFFcEMsU0FBUyxxQkFBcUI7SUFFMUIsSUFBSSxJQUFJLEdBQ1I7UUFDSSxPQUFPLEVBQUUsRUFBRTtRQUVYLG9CQUFvQixFQUNwQjtZQUNJLGdCQUFnQixFQUFFLENBQUM7WUFDbkIsc0JBQXNCLEVBQUUsRUFBRTtZQUMxQixtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLHVCQUF1QixFQUFFLElBQUk7WUFDN0IsZ0JBQWdCLEVBQUUsSUFBSTtZQUV0QixlQUFlLEVBQUU7Z0JBQ2I7b0JBQ0ksZUFBZTtvQkFDZixvQkFBb0IsRUFBRSxDQUFDO29CQUN2QixRQUFRLEVBQUUsRUFBRTtvQkFDWixnQkFBZ0IsRUFBRTt3QkFDZDs0QkFDSSxJQUFJLEVBQUUsbUNBQW1DOzRCQUN6QyxXQUFXLEVBQUUscURBQXFEOzRCQUNsRSxTQUFTLEVBQUUsQ0FBQzt5QkFDZjt3QkFDRDs0QkFDSSxJQUFJLEVBQUUsbUNBQW1DOzRCQUN6QyxXQUFXLEVBQUUsc0RBQXNEOzRCQUNuRSxTQUFTLEVBQUUsRUFBRTt5QkFDaEI7d0JBQ0Q7NEJBQ0ksSUFBSSxFQUFFLG1DQUFtQzs0QkFDekMsV0FBVyxFQUFFLHNEQUFzRDs0QkFDbkUsU0FBUyxFQUFFLEVBQUU7eUJBQ2hCO3FCQUNKO2lCQUNKO2dCQUNEO29CQUNJLHNCQUFzQjtvQkFDdEIsb0JBQW9CLEVBQUUsR0FBRztvQkFDekIsUUFBUSxFQUFFLEVBQUU7b0JBQ1osZ0JBQWdCLEVBQUU7d0JBQ2Q7NEJBQ0ksSUFBSSxFQUFFLGtDQUFrQzs0QkFDeEMsV0FBVyxFQUFFLHNEQUFzRDs0QkFDbkUsU0FBUyxFQUFFLEVBQUU7eUJBQ2hCO3dCQUNEOzRCQUNJLElBQUksRUFBRSxrQ0FBa0M7NEJBQ3hDLFdBQVcsRUFBRSxzREFBc0Q7NEJBQ25FLFNBQVMsRUFBRSxFQUFFO3lCQUNoQjt3QkFDRDs0QkFDSSxJQUFJLEVBQUUsa0NBQWtDOzRCQUN4QyxXQUFXLEVBQUUsdURBQXVEOzRCQUNwRSxTQUFTLEVBQUUsR0FBRzt5QkFDakI7cUJBQ0o7aUJBQ0o7Z0JBQ0Q7b0JBQ0ksa0JBQWtCO29CQUNsQixvQkFBb0IsRUFBRSxDQUFDO29CQUN2QixRQUFRLEVBQUUsR0FBRztvQkFDYixnQkFBZ0IsRUFBRTt3QkFDZDs0QkFDSSxJQUFJLEVBQUUsbUNBQW1DOzRCQUN6QyxXQUFXLEVBQUUsc0RBQXNEOzRCQUNuRSxTQUFTLEVBQUUsRUFBRTt5QkFDaEI7d0JBQ0Q7NEJBQ0ksSUFBSSxFQUFFLG1DQUFtQzs0QkFDekMsV0FBVyxFQUFFLHNEQUFzRDs0QkFDbkUsU0FBUyxFQUFFLEVBQUU7eUJBQ2hCO3dCQUNEOzRCQUNJLElBQUksRUFBRSxtQ0FBbUM7NEJBQ3pDLFdBQVcsRUFBRSx1REFBdUQ7NEJBQ3BFLFNBQVMsRUFBRSxHQUFHO3lCQUNqQjtxQkFDSjtpQkFDSjthQUNKO1lBRUQsWUFBWSxFQUNaO2dCQUNJLE9BQU8sRUFBRSxFQUFFO2dCQUNYLFNBQVMsRUFBRSxHQUFHO2FBQ2pCO1lBRUQsb0JBQW9CLEVBQ3BCO2dCQUNJLFNBQVMsRUFBRSxHQUFHO2dCQUNkLFFBQVEsRUFBRSxFQUFFO2dCQUNaLE1BQU0sRUFBRSxJQUFJO2FBQ2Y7U0FDSjtLQUNKLENBQUM7SUFFRixxQkFBcUIsQ0FBRSxJQUFJLENBQUUsQ0FBQztBQUNsQyxDQUFDIn0=