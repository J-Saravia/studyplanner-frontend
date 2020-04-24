import * as React from 'react';
import { Chip, StyledComponentProps, withStyles } from '@material-ui/core';
import ModuleVisit from '../../../model/ModuleVisit';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import SemesterStatisticsStyle from './SemesterStatisticsStyle';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

interface SemesterStatisticsProps
  extends StyledComponentProps,
    WithTranslation {
  classes: ClassNameMap;
  moduleVisits: ModuleVisit[];
}

class SemesterStatistics extends React.Component<SemesterStatisticsProps, any> {
  constructor(props: Readonly<SemesterStatisticsProps>) {
    super(props);
    this.state = {};
  }

  private getTotalEcts() {
    const { moduleVisits } = this.props;
    let total = 0;
    if (moduleVisits.length !== 0) {
      total = moduleVisits
        .map((m) => m.module.credits)
        .reduce(function (a, b) {
          return a + b;
        });
    }
    return total.toString();
  }

  private getTotalPositive() {
    const { moduleVisits } = this.props;
    let passedModule = moduleVisits.filter((m) => m.state === 'passed');
    let total = 0;
    if (passedModule.length !== 0) {
      total = passedModule
        .map((m) => m.module.credits)
        .reduce(function (a, b) {
          return a + b;
        });
    }

    return total.toString();
  }

  private getTotalNegative() {
    const { moduleVisits } = this.props;
    let failedModule = moduleVisits.filter((m) => m.state === 'failed');
    let total = 0;
    if (failedModule.length !== 0) {
      total = failedModule
        .map((m) => m.module.credits)
        .reduce(function (a, b) {
          return a + b;
        });
    }
    return total.toString();
  }

  private getAvgGrade() {
    const { moduleVisits } = this.props;

    let weightedGradeSum = 0;
    let totalEtc = 0;
    let gradedModules = moduleVisits
      .filter((m) => m.state !== 'planned' && m.state !== 'ongoing')
      .filter((mv) => mv.grade !== 0);
    if (gradedModules.length !== 0) {
      gradedModules.forEach((m) => {
        const etc = m.module.credits;
        totalEtc += etc;
        weightedGradeSum += etc * m.grade;
      });
      let total = weightedGradeSum / totalEtc;
      if (Number.isInteger(total)) {
        return total.toString();
      } else {
        return total.toFixed(2);
      }
    }
    return 'N/D';
  }

  private getHighGrade() {
    const { moduleVisits } = this.props;
    let gradedModule = moduleVisits
      .filter((m) => m.state !== 'planned' && m.state !== 'ongoing')
      .filter((mv) => mv.grade !== 0);
    if (gradedModule.length !== 0) {
      let total = gradedModule
        .map((mv) => mv.grade)
        .reduce(function (a, b) {
          return a > b ? a : b;
        });
      return total.toString();
    }
    return 'N/D';
  }

  private getTotalMsps() {
    const { moduleVisits } = this.props;
    let total = moduleVisits
      .map((m) => m.module.msp)
      .filter((ms) => ms !== 'NONE').length;
    return total.toString();
  }

  private getOralMsps() {
    const { moduleVisits } = this.props;
    let total = moduleVisits
      .map((m) => m.module.msp)
      .filter((ms) => ms === 'ORAL').length;
    return total.toString();
  }

  private getWrittenMsps() {
    const { moduleVisits } = this.props;
    let total = moduleVisits
      .map((m) => m.module.msp)
      .filter((ms) => ms === 'WRITTEN').length;
    return total.toString();
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.group}>
          <div className={classes.groupTitle}>ECTS</div>
          {this.getChip('ects.total', this.getTotalEcts())}
          {this.getChip('ects.passed', this.getTotalPositive())}
          {this.getChip('ects.failed', this.getTotalNegative())}
        </div>
        <div className={classes.group}>
          <div className={classes.groupTitle}>
            <Trans>translation:messages.semesterStatistic.grade.title</Trans>
          </div>
          {this.getChip('grade.avg', this.getAvgGrade())}
          {this.getChip('grade.high', this.getHighGrade())}
        </div>
        <div className={classes.group}>
          <div className={classes.groupTitle}>MSP</div>
          {this.getChip('msp.total', this.getTotalMsps())}
          {this.getChip('msp.written', this.getWrittenMsps())}
          {this.getChip('msp.oral', this.getOralMsps())}
        </div>
      </div>
    );
  }

  private getChip(label: string, value: string) {
    const { classes } = this.props;
    return (
      <Chip
        tabIndex={-1}
        label={
          <div>
            <div className={classes.label}>
              <Trans>translation:messages.semesterStatistic.{label}</Trans>
            </div>
            <div className={classes.value}>{value}</div>
          </div>
        }
        color="primary"
        classes={{
          root: classes.elem,
        }}
        style={{
          height: '60px',
        }}
      />
    );
  }
}

export default withTranslation()(
  withStyles(SemesterStatisticsStyle)(SemesterStatistics)
);
